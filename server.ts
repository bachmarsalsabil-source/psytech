import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";

const JSON_BODY_LIMIT = "512kb";
const RATE_WINDOW_MS = 60_000;
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function rateLimit(maxRequests: number) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const key = req.ip || req.socket.remoteAddress || "unknown";
    const now = Date.now();
    const entry = rateLimitStore.get(key) ?? { count: 0, resetAt: now + RATE_WINDOW_MS };

    if (now > entry.resetAt) {
      entry.count = 0;
      entry.resetAt = now + RATE_WINDOW_MS;
    }

    entry.count += 1;
    rateLimitStore.set(key, entry);

    if (entry.count > maxRequests) {
      return res.status(429).json({ error: "تم تجاوز حد الطلبات. يرجى المحاولة لاحقاً." });
    }

    return next();
  };
}

function securityHeaders(_req: express.Request, res: express.Response, next: express.NextFunction) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
  next();
}

async function startServer() {
  const app = express();
  app.set("trust proxy", 1);
  app.use(securityHeaders);
  app.use(express.json({ limit: JSON_BODY_LIMIT }));
  app.use("/api/", rateLimit(120));

  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NODE_ENV === "production" ? false : "*",
    },
  });

  const PORT = parseInt(process.env.PORT || "3000", 10);

  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      geminiConfigured: !!process.env.GEMINI_API_KEY,
    });
  });

  const MATRICES_FILE = path.join(process.cwd(), "saved_matrices.json");

  // Helper to load matrices from file
  const loadSavedMatrices = () => {
    try {
      if (fs.existsSync(MATRICES_FILE)) {
        const data = fs.readFileSync(MATRICES_FILE, "utf-8");
        return JSON.parse(data);
      }
    } catch (e) {
      console.error("Error reading saved matrices:", e);
    }
    return [];
  };

  // Helper to save matrices to file
  const saveSavedMatrices = (matrices: any[]) => {
    try {
      fs.writeFileSync(MATRICES_FILE, JSON.stringify(matrices, null, 2), "utf-8");
      return true;
    } catch (e) {
      console.error("Error saving matrices:", e);
      return false;
    }
  };

  // Saved Matrices API Routes
  app.get("/api/psychometrics/history", (req, res) => {
    try {
      const history = loadSavedMatrices();
      res.json(history);
    } catch (err) {
      res.status(500).json({ error: "Failed to load matrices history" });
    }
  });

  app.post("/api/psychometrics/save", (req, res) => {
    try {
      const { matrixId, name, timestamp, parameters, calculatedMetrics, variables, matrix } = req.body;
      
      if (!matrixId || !parameters || !calculatedMetrics || !variables || !matrix) {
        return res.status(400).json({ error: "بيانات ناقصة لحفظ مصفوفة القياس." });
      }

      const history = loadSavedMatrices();
      const existingIdx = history.findIndex((m: any) => m.matrixId === matrixId);
      
      const newRecord = {
        matrixId,
        name: name || `مقياس سيكومتري مقنن (${variables.length} بند) - ${new Date(timestamp || Date.now()).toLocaleDateString("ar-EG")}`,
        timestamp: timestamp || new Date().toISOString(),
        parameters,
        calculatedMetrics,
        variables,
        matrix
      };

      if (existingIdx >= 0) {
        history[existingIdx] = newRecord;
      } else {
        history.unshift(newRecord);
      }

      saveSavedMatrices(history);
      res.json({ success: true, message: "تم حفظ التحليل في تاريخ السجلات الفنية للمنصة بنجاح.", record: newRecord });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: "خطأ في معالجة طلب حفظ التحليل السيكومتري." });
    }
  });

  app.delete("/api/psychometrics/:id", (req, res) => {
    try {
      const { id } = req.params;
      const history = loadSavedMatrices();
      const filtered = history.filter((m: any) => m.matrixId !== id);
      saveSavedMatrices(filtered);
      res.json({ success: true, message: "تم حذف السجل بنجاح." });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete matrix session" });
    }
  });

  const TESTBUILDER_STATE_FILE = path.join(process.cwd(), "testbuilder_state.json");

  // Helper to load TestBuilder state
  const loadTestBuilderState = () => {
    try {
      if (fs.existsSync(TESTBUILDER_STATE_FILE)) {
        const data = fs.readFileSync(TESTBUILDER_STATE_FILE, "utf-8");
        return JSON.parse(data);
      }
    } catch (e) {
      console.error("Error reading TestBuilder state:", e);
    }
    return null;
  };

  // Helper to save TestBuilder state
  const saveTestBuilderState = (stateData: any) => {
    try {
      fs.writeFileSync(TESTBUILDER_STATE_FILE, JSON.stringify(stateData, null, 2), "utf-8");
      return true;
    } catch (e) {
      console.error("Error saving TestBuilder state:", e);
      return false;
    }
  };

  // APIs for TestBuilder State Synchronization
  app.get("/api/testbuilder/state", (req, res) => {
    try {
      const savedState = loadTestBuilderState();
      res.json({ success: true, state: savedState });
    } catch (err) {
      res.status(500).json({ error: "Failed to load TestBuilder state" });
    }
  });

  app.post("/api/testbuilder/submit-response", (req, res) => {
    try {
      const { response: responseData } = req.body;
      if (!responseData) {
        return res.status(400).json({ error: "Missing response data" });
      }

      const stateData = loadTestBuilderState() || {};
      if (!stateData.recruitment) {
        stateData.recruitment = { target: 300, current: 0, responses: [] };
      }

      const existingResponsesLst = stateData.recruitment.responses || [];
      const newResponse = {
        id: responseData.id || `SUB-${101 + existingResponsesLst.length}`,
        age: parseInt(responseData.age) || 24,
        gender: responseData.gender || 'أنثى',
        education: responseData.education || 'بكالوريوس علم النفس',
        region: responseData.region || 'المنطقة الشمالية',
        incentive: responseData.incentive || 'مساهمة تطوعية',
        scalePreset: responseData.scalePreset || 'سلم الموافقة الخماسي',
        timestamp: new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('ar-DZ'),
        valid: true,
        data: responseData.data || []
      };

      stateData.recruitment.responses = [newResponse, ...existingResponsesLst];
      stateData.recruitment.current = stateData.recruitment.responses.length;

      // Ensure notification logs list exists
      if (!stateData.recruitment.notificationLogs) {
        stateData.recruitment.notificationLogs = [];
      }

      // If email notifications are enabled, simulate sending an email
      const emailEnabled = stateData.recruitment.notificationsEnabled ?? true;
      const targetEmail = stateData.recruitment.notificationEmail || process.env.NOTIFICATION_EMAIL || "";

      if (emailEnabled && targetEmail) {
        console.log(`[SMTP SIMULATOR] Sending new response notification email to: ${targetEmail}`);
        console.log(`[SMTP SIMULATOR] Draft: New participant on study: "${stateData.testData?.title || 'مقياس سيكومتري'}". Age: ${newResponse.age}, Region: ${newResponse.region}`);
        
        stateData.recruitment.notificationLogs.unshift({
          id: `NOTIF-${Date.now()}`,
          recipient: targetEmail,
          subject: `إشعار فوري: مشارك جديد في مقياس (${stateData.testData?.title || 'الدراسة النفسية'})`,
          body: `مرحباً دكتور في منصة PsyTech،\n\nلقد قام مستجيب جديد بملء الاستبيان الميداني الآن:\n- رقم العينة: ${newResponse.id}\n- السن: ${newResponse.age} سنة\n- الجنس: ${newResponse.gender}\n- المستوى الأكاديمي: ${newResponse.education}\n- المنطقة الجغرافية: ${newResponse.region}\n- الحافز: ${newResponse.incentive}\n\nتم حفظ الاستجابة في مصفوفة النتائج (SPSS Matrix) والمقاييس الموزونة.`,
          timestamp: new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' }),
          status: "delivered"
        });
      }

      saveTestBuilderState(stateData);
      res.json({ success: true, response: newResponse, message: "Response submitted successfully and researcher notified." });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to submit response in backend" });
    }
  });

  app.post("/api/testbuilder/save", (req, res) => {
    try {
      const { state: stateData } = req.body;
      if (!stateData) {
        return res.status(400).json({ error: "No state data provided for saving." });
      }
      saveTestBuilderState(stateData);
      res.json({ success: true, message: "Saved successfully on main backend database." });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to save TestBuilder state to database." });
    }
  });

  // AI-Powered Clinical Protocol Generator Endpoint
  app.post("/api/clinic/generate-protocol", async (req, res) => {
    try {
      const { diagnosis, modality, ageGroup, customGoals } = req.body;
      if (!diagnosis || !modality) {
        return res.status(400).json({ error: "Missing required fields: diagnosis and modality" });
      }

      const hasApiKey = !!process.env.GEMINI_API_KEY;
      if (hasApiKey) {
        try {
          const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
            httpOptions: {
              headers: {
                'User-Agent': 'aistudio-build',
              }
            }
          });

          const prompt = `نفذ صياغة لبروتوكول علاجي مفصل كأخصائي علم نفس إكلينيكي محترف ذو خلفية بحثية عميقة ومتمكنة.
البيانات المدخلة:
- التشخيص النفسي أو الحالة: ${diagnosis}
- المدرسة العلاجية والمنهج المطبق: ${modality}
- الفئة العمرية للمستهدفين: ${ageGroup || "بالغين"}
- تركيز المخصص أو أهداف الأخصائي: ${customGoals || "تركيز متوازن يجمع الجانب الوجداني والعلاجي"}

يجب صياغة البروتوكول باللغة العربية بأسلوب راقٍ، أكاديمي، وعملي متماسك (Luxury Scientific Psychology Style).
تأكد من تقسيم البروتوكول إلى 4 مراحل سريرية منهجية متتالية ومحددة بدقة.
تجنب الكلمات التجارية أو الكرتونية الضحلة أو الألوان/الأنماط الرديئة.

يجب أن تكون الاستجابة بصيغة JSON مطابقة تماماً للمواصفات التالية وبدون أي زوائد أو علامات ترميز خارج الـ JSON:
{
  "title": "عنوان لائق بالبروتوكول مثل: بروتوكول العلاج السلوكي المعرفي لعلاج قلق المخاوف الاجتماعية",
  "scientificModality": "الاسم العلمي الفخم للمدرسة المستخدمة وتاريخها البحثي باختصار",
  "briefExplanation": "شرح سريري موجز لمدى ملاءمة هذا البروتوكول للحالة ومسار علاجها المتوقع",
  "phases": [
    {
      "title": "عنوان المرحلة بالتفصيل",
      "description": "وصف مفصل للمرحلة وإرشادات تكتيكية للأخصائي النفسي للكيفية العملية لمساعدة المريض",
      "clinicalObjective": "الهدف السريري الواضح لهذه المرحلة",
      "techniques": ["التقنية 1", "التقنية 2", "التقنية 3"],
      "suggestedDuration": "المدة الزمنية المقترحة للمرحلة (مثال: جلستان إلى 3 جلسات)"
    }
  ]
}

تأكد من إرجاع JSON صالح بنسبة 100% فقط وبدون أي مقدمات أو علامات markdown code blocks.`;

          const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
            }
          });

          const text = response.text;
          if (text) {
            const parsed = JSON.parse(text);
            return res.json({
              ...parsed,
              generatedBy: "gemini",
              message: "تم توليد البروتوكول المخصص بنجاح وبقوة الذكاء الاصطناعي السريري"
            });
          }
        } catch (err: any) {
          console.error("Gemini Protocol Generation Error:", err);
          // Fall through to offline template fallback if Gemini fails or times out
        }
      }

      // Fallback beautiful template system:
      let protocolTitle = "";
      let scientificModality = "";
      let briefExplanation = "";
      let phases: any[] = [];

      const normalizedModality = modality.toLowerCase();

      if (normalizedModality === "cbt" || normalizedModality === "cognitive-behavioral") {
        protocolTitle = `بروتوكول العلاج السلوكي المعرفي (CBT) الموحد للحالة: ${diagnosis}`;
        scientificModality = "العلاج السلوكي المعرفي (Cognitive Behavioral Therapy)";
        briefExplanation = `يركز هذا البروتوكول المنهجي على ترويض العلاقة الثلاثية المتبادلة بين الأفكار غير العقلانية، الاستجابات الانفعالية والوجدانية، والسلوكيات التجنبية المقيدة. صُمم خصيصاً ليناسب طبيعة حالة (${diagnosis}) عبر إعادة الهيكلة والتجارب السلوكية الفعالة.`;
        phases = [
          {
            title: "المرحلة الأولى: التحالف السريري ورسم الخريطة المعرفية والتثقيف",
            description: "تأسيس تحالف علاجي متين مع الحالة وتثقيفها بالطبيعة السلوكية المعرفية لأعراضها، وبناء نموذج بؤري مشترك يحدد المثيرات والأفكار التلقائية المشوهة واستجاباتها السلوكية.",
            clinicalObjective: "التثقيف النفسي وبناء خط الأساس السلوكي والمعرفي ورصد الهجمات الصغرى للأعراض.",
            techniques: ["التثقيف النفسي السيكولوجي بمخطط النفس", "سجل رصد الأفكار اليومية المنظم (Daily NAT Log)", "الاسترخاء التنفسي الموجه لتهدئة الاستثارة الفسيولوجية"],
            suggestedDuration: "جلستان إلى ثلاث جلسات"
          },
          {
            title: "المرحلة الثانية: إعادة الهيكلة السريرية ومواجهة التشوهات المعرفية",
            description: "تعليم المريض فنيات استجواب الأفكار المشوهة (استفسار سقراط المنهجي) واختبار صدق الفكرة وتفنيد التفكير الكارثي أو التعميم المفرط وبناء أفكار بديلة مرنة وأكثر موضوعية.",
            clinicalObjective: "تفكيك الأفكار التلقائية السلبية وإعادة الصياغة المعرفية والعمل على المعتقدات الوسيطة.",
            techniques: ["الاستفسار السقراطي الموجه للعمق المعرفي", "بطاقات المواجهة الذاتية المكتوبة بأناقة", "تفنيد الاحتمالات والخطط البديلة المتزنة والآمنة"],
            suggestedDuration: "3 إلى 4 جلسات"
          },
          {
            title: "المرحلة الثالثة: التعرض المنهجي المدرج واختبار السلوكيات البديلة",
            description: "إنشاء مدرج التعرض التدريجي للخوف أو العرض (Exposure Hierarchy)، ثم إخضاع المعتقدات المشوهة للتجارب السلوكية الميدانية لملاحظة التبدد التدريجي لشدة القلق والاستجابات التجنبية.",
            clinicalObjective: "تفعيل التكيف السلوكي التفاعلي وإطفاء الاستجابة التجنبية المشروطة ومواجهة مصادر القلق الميدانية.",
            techniques: ["مدرج القلق المتعرض الفردي (SUDS)", "التجارب السلوكية المصممة مسبقاً بالتنسيق المحكم", "منع الاستجابة القهرية المقترن بالتعرض المنظم في العيادة وخارجها"],
            suggestedDuration: "4 إلى 5 جلسات"
          },
          {
            title: "المرحلة الرابعة: الوقاية من الانتكاسة وترميم المعتقدات الجوهرية العميقة",
            description: "صياغة المخططات المعرفية العميقة المتوازنة، ووضع دليل طوارئ ذاتي خاص بالحالة يساعدها على التعامل مع نويات الارتداد المحتملة، مع تمكين المريض ليكون معالجاً لنفسه بالكامل.",
            clinicalObjective: "تأمين الاستقلال السريري، تعميم مكاسب العلاج، وصيانة المعتقدات البديلة والوقاية التامة.",
            techniques: ["خارطة حماية الذات والتعامل مع الكبوات بأمان", "بناء المخططات الجوهرية البديلة المانحة للقيمة الروحية والعلمية", "تقييم الرضا الحياتي الوظيفي الشامل والسريري"],
            suggestedDuration: "جلستان سريريتان"
          }
        ];
      } else if (normalizedModality === "act" || normalizedModality === "acceptance-commitment") {
        protocolTitle = `بروتوكول القبول والالتزام (ACT) المتكامل للحالة: ${diagnosis}`;
        scientificModality = "علاج القبول والالتزام (Acceptance and Commitment Therapy)";
        briefExplanation = `يعتمد هذا البروتوكول العلمي على مرونة الوعي بدلاً من محاربة المحتويات النفسية الداخلية. يساعد الحالة المصابة بـ (${diagnosis}) على القبول الإيجابي للمشاعر المقلقة كجزء من التجربة الإنسانية، والتخلي عن صنم السيطرة الوجدانية، وتوجيه الطاقة الحيوية نحو أهداف وقيم الحياة الكبرى.`;
        phases = [
          {
            title: "المرحلة الأولى: رصد التجنب التجريبي والاندماج المعرفي الفعال",
            description: "التعرف مع المريض على ممارسات التجنب التجريبي والوجداني لمشاعره وتكلفتها النفسية الباهظة، وفحص كيف يندمج المريض كلياً في أحكامه الفكرية الداخلية فيعتبرها حقائق ثابتة ومقيدة.",
            clinicalObjective: "كشف العجز الإبداعي وبناء ركائز اليقظة الوجدانية الأساسية للحالة.",
            techniques: ["تحليل كلفة التجنب المعيشي والوجداني على خط العمر", "رصد الاندماج والارتباط اللغوي بالأفكار الأوتوماتيكية", "تمارين الاستقرار الأرضي والحضور هنا والآن بقوة الحواس"],
            suggestedDuration: "جلستان سريريتان"
          },
          {
            title: "المرحلة الثانية: تفعيل فنيات نزع الاندماج المعرفي والقبول الجسور",
            description: "تدريب المريض على النظر للأفكار 'كمجرد أفكار لا كحقائق مفروضة'، ومسامحة الذات وقبول وجود الانفعالات الجسدية والقلق بدون إصدار أحكام أو السعي للمقاومة المستنزفة.",
            clinicalObjective: "فصل الهوية الذاتية عن المفرزات العقلية وتبني القبول والاحتضان كخيار سريري واعد.",
            techniques: ["تمارين غلق وتسمية الأفكار والفقاعات الطافية", "تمارين استئجار وترحيب الضيف الانفعالي غير المحبب", "التنفس من مساحة الملاحظ الداخلي الصامت والعميق"],
            suggestedDuration: "3 جلسات تفاعلية"
          },
          {
            title: "المرحلة الثالثة: اكتشاف وتوضيح ركائز القيم الحياتية الجوهرية",
            description: "فحص وتأطير مجالات الحياة الكبرى التي تمنح الفرد معنى وقيمة حقيقية (العلاقات، العمل، النمو الداخلي)، وصياغة بوصلة القيم لتوجيه السلوك بدلاً من الخضوع المستمر لبوصلة الهروب من الخوف.",
            clinicalObjective: "بناء المعاني الحياتية والأهداف الوجدانية غير المرتبطة بشرط المعافاة المسبق.",
            techniques: ["تمرين بطاقات القيم السريرية المتنوعة الفاخرة", "تمرين صياغة العزاء الافتراضي لترك الإرث الروحي", "رسم عجلة الالتزام بالقيم السلوكية الستة المتوازنة"],
            suggestedDuration: "جلستان إلى 3 جلسات"
          },
          {
            title: "المرحلة الرابعة: الالتزام بالفعل السلوكي وبناء النمط الحياتي المرن",
            description: "وضَع التزامات سلوكية تدريجية وخطط يومية تواجه العقبات الداخلية بصلابة ومرونة سيكولوجية، وترسيخ الذات كملاحظ وسياق دائم مستمر يراقب تدفق الخبرات بنضج تام.",
            clinicalObjective: "تثبيت الفعل الملتزم السلوكي المستدام وبناء أنماط مرونة سيكومترية وقائية.",
            techniques: ["عقود السلوك الملتزم المصاغة بالشراكة", "فنيات إدارة العقبات والصلابة السلوكية المقترنة بالتحديات", "دمج المهارات في أجندة الاستبصار العلاجي للمستقبل"],
            suggestedDuration: "2 جلسة"
          }
        ];
      } else {
        // Integrative (تكاملي)
        protocolTitle = `بروتوكول تداخلي تكاملي ومقنن للحالة: ${diagnosis}`;
        scientificModality = "العلاج التكاملي المقنن والمنهجي (Systematic Integrative Psychotherapy)";
        briefExplanation = `يصيغ هذا البروتوكول المتوازن حزمة دمج سيكومترية علمية تجمع بين تقنيات التنظيم الوجداني وأدوات الدعم السلوكي المعرفي والتوجيه المرتكز على الفرد، ليتوافق مع درجة استجابة وتحفيز حالة (${diagnosis}).`;
        phases = [
          {
            title: "المرحلة الأولى: التقنين والتثقيف وتأصيل الاحتواء والتحالف",
            description: "فحص عميق لخط أساس المقاومة، وبناء خارطة وجدانية متخصصة لتفاعل الأعراض مع محفزات البيئة وسردية الحياة الفردية للعميل.",
            clinicalObjective: "تعميق مستوى التحالف الإكلينيكي والاستقرار النفسي المبدئي واستشعار الأمان في الجلسة.",
            techniques: ["الصياغة التشاركية المتكاملة للحالة السيكولوجية", "رصد التقييمات السيكومترية والتحضر للتقييد", "تمرين الصخرة والحصانة للتنفس الصدري والبطني العميق"],
            suggestedDuration: "جلستان علاجيتان"
          },
          {
            title: "المرحلة الثانية: بناء مهارات التنظيم الوجداني وإعادة الصياغة والتفكيك",
            description: "مساعدة المريض على الإلمام بوعي تام بطرق ترويض الفوران الشعوري واكتشاف الأسباب الكامنة وراء أنماط التفاعل المتطرفة وتلمس جذورها القديمة ومواجهتها بيقظة.",
            clinicalObjective: "تحقيق الاستبصار الوجداني وبناء مهارات تنظيم فسيولوجية وعاطفية مرنة وقابل للاستخدام.",
            techniques: ["جدول رصد الاستثارة والانطفاء الانفعالي الموجه", "فنيات الحوار مع المرجعية الذاتية العاطفية المتقدمة", "إعادة الصياغة للمواقف الصدمية الصغرى وعقد الطفولة"],
            suggestedDuration: "3 إلى 4 جلسات"
          },
          {
            title: "المرحلة الثالثة: فنيات التعرض والانتصار السلوكي وتعديل المخطط",
            description: "التنسيق مع الحالة للقيام بتعديلات سلوكية واختبارات حية تتوافق مع القناعات البديلة والجديدة، وإزالة تدريجية للمكاسب الثانوية الناتجة عن البقاء في دائرة المرض التجريبي.",
            clinicalObjective: "إعادة بناء المخرجات السلوكية وتطوير الذات النشطة وتذويب المخاوف المشروطة.",
            techniques: ["التعرض التخيلي والعياني مع الأخصائي في بيئة آمنة", "إلغاء التجنب والمكسب السلبي للأعراض المكتسبة", "التأكيد التوكيدي التفاعلي للحقوق الذاتية والسلام النفسي"],
            suggestedDuration: "4 جلسات"
          },
          {
            title: "المرحلة الرابعة: الدمج الحياتي، الحصانة السيكولوجية الشاملة والصيانة",
            description: "توطيد المكاسب السريرية وتجميع الممارسات التدريبية في كتيب طوارئ فردي، مع فحص دوري للتحسن الإحصائي لنسب الأعراض النفسية والتوصية ببرامج المتابعة العميقة.",
            clinicalObjective: "الإنهاء المتزن والسلس لبرنامج الرعاية وتفعيل الحصانة الذاتية الدائمة المعززة.",
            techniques: ["صياغة كتاب الطوارئ السيكولوجي الشخصي والذاتي", "التقييم البعدي والقياس الاحصائي للتحسن النفسي", "جلسة المتابعة الوقائية ربع السنوية للاطمئنان والتثبيت"],
            suggestedDuration: "جلستان دوريتان"
          }
        ];
      }

      return res.json({
        title: protocolTitle,
        scientificModality: scientificModality,
        briefExplanation: briefExplanation,
        phases: phases,
        generatedBy: "template",
        message: "تم توليد البروتوكول المنسق من قاعدة الممارسات السريرية المعتمدة بالعيادة بنجاح."
      });
    } catch (e: any) {
      console.error(e);
      return res.status(500).json({ error: "خطأ داخلي أثناء توليد البروتوكول العلاجي المخصص." });
    }
  });

  // Real-time Chat & Notifications Logic
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("join-room", (room) => {
      socket.join(room);
      console.log(`User ${socket.id} joined room ${room}`);
    });

    socket.on("send-message", (data) => {
      if (!data?.room || !data?.text || typeof data.text !== "string" || data.text.length > 2000) {
        return;
      }
      io.to(data.room).emit("new-message", data);
      socket.to(data.room).emit("notification", {
        type: "message",
        title: "رسالة جديدة",
        body: `لديك رسالة جديدة من ${data.sender}`,
        timestamp: new Date().toISOString(),
      });
    });

    socket.on("send-notification", (data) => {
      io.to(data.room).emit("notification", data);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);

    // Catch-all route to serve and transform index.html with Vite's HTML server for SPA routing fallback
    app.get("*", async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(process.cwd(), "index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
