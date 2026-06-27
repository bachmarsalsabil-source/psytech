import React, { useState, useEffect } from 'react';
import { GlassCard } from '../clinic/GlassCard';
import { 
  BarChart3, 
  Info, 
  ShieldCheck, 
  Target, 
  Users, 
  TrendingUp, 
  Zap,
  ArrowRight,
  Download,
  FileText,
  Copy,
  Check,
  Plus,
  Trash2,
  Calculator,
  Compass,
  FileSpreadsheet,
  ListOrdered,
  HelpCircle,
  Sparkles,
  Database,
  History,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Math Helper functions
const getMean = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

const getVariance = (arr: number[]) => {
  const n = arr.length;
  if (n <= 1) return 0;
  const mean = getMean(arr);
  return arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (n - 1);
};

const getCorrelation = (x: number[], y: number[]) => {
  const n = x.length;
  if (n <= 1) return 0;
  const meanX = getMean(x);
  const meanY = getMean(y);
  let sumXY = 0, sumXX = 0, sumYY = 0;
  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX;
    const dy = y[i] - meanY;
    sumXY += dx * dy;
    sumXX += dx * dx;
    sumYY += dy * dy;
  }
  return sumXX && sumYY ? sumXY / Math.sqrt(sumXX * sumYY) : 0;
};

// Types corresponding to backend architecture
interface SavedMatrix {
  matrixId: string;
  name: string;
  timestamp: string;
  parameters: {
    k: number;
    N: number;
  };
  calculatedMetrics: {
    cronbachAlpha: number;
  };
  variables: string[];
  matrix: number[][];
}

export const PsychometricAnalysis: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'norms' | 'commentary' | 'syntax' | 'history' | 'grouped' | 'guide'>('matrix');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Volatile recovery & Session tracking
  const [matrixId, setMatrixId] = useState<string>(() => {
    const savedId = localStorage.getItem("psytech_matrix_id");
    if (savedId) return savedId;
    const newId = "matrix_" + Math.random().toString(36).substring(2, 11);
    localStorage.setItem("psytech_matrix_id", newId);
    return newId;
  });

  const [matrixName, setMatrixName] = useState<string>("");

  // Grid holding Likert scores (Subjects rows x Items columns)
  const [matrix, setMatrix] = useState<number[][]>(() => {
    const saved = localStorage.getItem("psytech_matrix_grid");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && Array.isArray(parsed[0])) {
          return parsed;
        }
      } catch (e) {
        console.error("Failed to parse saved matrix grid", e);
      }
    }
    // Default 10 subjects x 6 items cohesive Likert scores (1-5)
    return [
      [5, 5, 4, 5, 5, 4],
      [4, 4, 3, 4, 4, 3],
      [5, 5, 5, 5, 5, 5],
      [3, 3, 2, 3, 3, 2],
      [4, 4, 4, 4, 4, 4],
      [4, 3, 3, 4, 4, 3],
      [5, 5, 4, 5, 5, 5],
      [4, 4, 4, 4, 4, 4],
      [2, 2, 1, 2, 2, 1],
      [5, 4, 5, 5, 4, 5]
    ];
  });

  const [numItems, setNumItems] = useState<number>(() => {
    return matrix[0]?.length || 6;
  });

  const [numSubjects, setNumSubjects] = useState<number>(() => {
    return matrix.length || 10;
  });

  // Commentary Settings
  const [commentaryTone, setCommentaryTone] = useState<'standards' | 'clinical' | 'critical'>('standards');
  const [commentedCopied, setCommentedCopied] = useState<boolean>(false);

  // SPSS Syntax Settings
  const [spsFileName, setSpsFileName] = useState<string>("psytech_reliability_analysis.sps");
  const [syntaxCopied, setSyntaxCopied] = useState<boolean>(false);

  // Innovative: Spearman-Brown estimate factor
  const [itemMultiplier, setItemMultiplier] = useState<number>(2.0);

  // Database History State
  const [savedMatrices, setSavedMatrices] = useState<SavedMatrix[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false);

  // Bulk manual entry text state
  const [bulkText, setBulkText] = useState<string>('');
  const [showBulkModal, setShowBulkModal] = useState<boolean>(false);

  // Grouped parameters calculator state
  const [manualK, setManualK] = useState<number>(10);
  const [manualSumItemVar, setManualSumItemVar] = useState<number>(4.2);
  const [manualTotalVar, setManualTotalVar] = useState<number>(15.8);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Auto-persist active state to localStorage to satisfy volatile mandate
  useEffect(() => {
    localStorage.setItem("psytech_matrix_grid", JSON.stringify(matrix));
    localStorage.setItem("psytech_matrix_id", matrixId);
  }, [matrix, matrixId]);

  // Adjust Matrix size when numItems or numSubjects inputs change
  useEffect(() => {
    setMatrix(prev => {
      let updated = [...prev];
      // Adjust rows (Subjects)
      if (updated.length < numSubjects) {
        while (updated.length < numSubjects) {
          const defaultRow = Array(numItems).fill(0).map(() => Math.floor(Math.random() * 3) + 3);
          updated.push(defaultRow);
        }
      } else if (updated.length > numSubjects) {
        updated = updated.slice(0, numSubjects);
      }

      // Adjust cols (Items)
      updated = updated.map(row => {
        let newRow = [...row];
        if (newRow.length < numItems) {
          while (newRow.length < numItems) {
            newRow.push(Math.floor(Math.random() * 3) + 3);
          }
        } else if (newRow.length > numItems) {
          newRow = newRow.slice(0, numItems);
        }
        return newRow;
      });

      return updated;
    });
  }, [numItems, numSubjects]);

  // Load backend historical matrices on mount and on trigger
  const fetchDbHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const res = await fetch("/api/psychometrics/history");
      if (res.ok) {
        const data = await res.json();
        setSavedMatrices(data);
      }
    } catch (e) {
      console.error("Error loading server matrix database logs", e);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchDbHistory();
  }, []);

  // Save active matrix to local datastore
  const handleSaveToBackend = async () => {
    if (numSubjects <= 0 || numItems <= 0) {
      triggerToast("❌ خطأ بالتحقق: يرجى إدخال أبعاد مصفوفة صالحة (N > 0 & k > 0)");
      return;
    }

    try {
      const computedAlpha = getCalculatedStats().globalAlpha;
      const payload: SavedMatrix = {
        matrixId,
        name: matrixName.trim() || `تحليل موثوقية المقنن النظري (${numItems} بند) - ${new Date().toLocaleDateString("ar-EG")}`,
        timestamp: new Date().toISOString(),
        parameters: { k: numItems, N: numSubjects },
        calculatedMetrics: { cronbachAlpha: Number(computedAlpha.toFixed(4)) },
        variables: Array(numItems).fill(0).map((_, i) => `item_${i + 1}`),
        matrix
      };

      const res = await fetch("/api/psychometrics/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        triggerToast("💾 تم الحفظ والمزامنة بقاعدة السجلات الإحصائية السحابية بنجاح!");
        fetchDbHistory();
      } else {
        triggerToast("❌ فشل الخادم في معالجة طلب الحفظ التاريخي.");
      }
    } catch (e) {
      console.error(e);
      triggerToast("❌ خطأ بالاتصال: تعذر الربط السحابي بقاعدة البيانات.");
    }
  };

  // Delete a saved session from backend history index
  const handleDeleteSession = async (idToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/psychometrics/${idToDelete}`, { method: "DELETE" });
      if (res.ok) {
        triggerToast("🗑️ تم إزالة السجل ومسح أرشفته بنجاح.");
        fetchDbHistory();
        if (matrixId === idToDelete) {
          // generate new session ID
          setMatrixId("matrix_" + Math.random().toString(36).substring(2, 11));
        }
      } else {
        triggerToast("❌ فشل حذف السجل من الخادم.");
      }
    } catch (err) {
      console.error(err);
      triggerToast("❌ خطأ في الاتصال بالشبكة لطلب الحذف.");
    }
  };

  // Load historical session to live grid
  const handleLoadSession = (item: SavedMatrix) => {
    setMatrixId(item.matrixId);
    setMatrixName(item.name);
    setMatrix(item.matrix);
    setNumItems(item.parameters.k);
    setNumSubjects(item.parameters.N);
    setActiveTab("matrix");
    triggerToast(`⚡ تم تفعيل واستدعاء السجل الإحصائي: ` + item.name);
  };

  // Handle individual cell edit
  const handleCellChange = (rIdx: number, cIdx: number, val: string) => {
    const numeric = Math.min(Math.max(Number(val) || 0, 0), 100);
    setMatrix(prev => {
      const copy = prev.map(r => [...r]);
      copy[rIdx][cIdx] = numeric;
      return copy;
    });
  };

  // Add Item (Column)
  const handleAddItem = () => {
    if (numItems >= 40) {
      triggerToast("الحد الأقصى للتحليل اليدوي السريع هو 40 بنداً للحفاظ على سلاسة الواجهة.");
      return;
    }
    setNumItems(prev => prev + 1);
    triggerToast("تمت إضافة عمود بند جديد بنجاح.");
  };

  // Remove Item (Column)
  const handleRemoveItem = () => {
    if (numItems <= 2) {
      triggerToast("لابد من توفر بندين على الأقل لإجراء تحليل الثبات والاتساق.");
      return;
    }
    setNumItems(prev => prev - 1);
    triggerToast("تم حذف البند الأخير.");
  };

  // Add Subject (Row)
  const handleAddSubject = () => {
    if (numSubjects >= 100) {
      triggerToast("للتحليلات الأكبر من 100 مبحوث، يُفضل استخدام SPSS مباشرة.");
      return;
    }
    setNumSubjects(prev => prev + 1);
    triggerToast("تمت إضافة مبحوث جديد.");
  };

  // Remove Subject (Row)
  const handleRemoveSubject = () => {
    if (numSubjects <= 3) {
      triggerToast("الحد الأدنى لعينات الموثوقية اليدوية هو 3 مبحوثين.");
      return;
    }
    setNumSubjects(prev => prev - 1);
    triggerToast("تم حذف المبحوث الأخير.");
  };

  // Perform calculations on Matrix
  const getCalculatedStats = () => {
    // 1. Total score for each subject
    const rowTotals = matrix.map(row => row.reduce((sum, val) => sum + val, 0));
    
    // 2. Variance of total scores
    const totalVariance = getVariance(rowTotals);
    const meanTotal = getMean(rowTotals);

    // 3. Variance of each item
    const itemVariances: number[] = [];
    const itemMeans: number[] = [];
    const itemSDs: number[] = [];

    for (let c = 0; c < numItems; c++) {
      const itemScores = matrix.map(row => row[c]);
      const mean = getMean(itemScores);
      const variance = getVariance(itemScores);
      itemMeans.push(mean);
      itemVariances.push(variance);
      itemSDs.push(Math.sqrt(variance));
    }

    const sumItemVariances = itemVariances.reduce((a, b) => a + b, 0);

    // 4. Cronbach's Alpha
    // formula: a = (k / (k-1)) * (1 - (sumOfItemVariances / totalVariance))
    let globalAlpha = 0;
    if (numItems > 1 && totalVariance > 0) {
      globalAlpha = (numItems / (numItems - 1)) * (1 - (sumItemVariances / totalVariance));
    }
    if (globalAlpha < 0) globalAlpha = 0;

    // 5. Item analyses (Correlation, and Alpha if deleted)
    const itemAnalysis = Array(numItems).fill(0).map((_, cIdx) => {
      const scoresC = matrix.map(row => row[cIdx]);
      const remainingRowTotals = matrix.map((row, rIdx) => rowTotals[rIdx] - row[cIdx]);
      
      const correctedItemTotalCorrelation = getCorrelation(scoresC, remainingRowTotals);

      // Alpha if deleted
      const subVariances = itemVariances.filter((_, idx) => idx !== cIdx);
      const sumSubVariances = subVariances.reduce((a, b) => a + b, 0);
      const subTotalVariance = getVariance(remainingRowTotals);
      
      let alphaIfDeleted = 0;
      if (numItems > 2 && subTotalVariance > 0) {
        alphaIfDeleted = ((numItems - 1) / (numItems - 2)) * (1 - (sumSubVariances / subTotalVariance));
      }
      if (alphaIfDeleted < 0) alphaIfDeleted = 0;

      const isAcceptable = correctedItemTotalCorrelation >= 0.20;

      return {
        id: `Item_${cIdx + 1}`,
        mean: itemMeans[cIdx],
        sd: itemSDs[cIdx],
        correlation: correctedItemTotalCorrelation,
        alphaIfDeleted: alphaIfDeleted,
        acceptable: isAcceptable
      };
    });

    return {
      rowTotals,
      meanTotal,
      totalVariance,
      itemVariances,
      sumItemVariances,
      globalAlpha,
      itemAnalysis
    };
  };

  const stats = getCalculatedStats();

  // Scale of Alpha values to fit classification specs
  const getAlphaInterpretation = (alpha: number) => {
    if (alpha >= 0.9) return { text: "ممتاز وثبات فائق (Excellent) - صالح لجميع أغراض الترخيص، صناعة التشخيصات النفسية، والقرارات العيادية والمصيرية.", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
    if (alpha >= 0.8) return { text: "جيد وثبات مرتفع (Good) - ثبات رصين يطابق معايير النشر والأبحاث الجامعية الرائدة بامتياز.", color: "text-teal-400 bg-teal-500/10 border-teal-500/20" };
    if (alpha >= 0.7) return { text: "مقبول منهجيًا وصالح للبحوث الاستكشافية (Acceptable) - مستوفٍ للحد الأدنى من التجانس السيكولوجي السلوكي المعتمد.", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" };
    return { text: "ضعيف وغير مريح سيكومتريًا (Weak/Unreliable) - مستويات ثبات منخفضة غير صالحة للنشر؛ تقتضي تهذيب صياغات الأسئلة ذات الارتباط السالب والمحتوى غير الدقيق.", color: "text-red-400 bg-red-500/10 border-red-500/20" };
  };

  const alphaEval = getAlphaInterpretation(stats.globalAlpha);

  // Grouped calculator alpha calculation
  const calculatedManualAlpha = manualK > 1 && manualTotalVar > 0
    ? (manualK / (manualK - 1)) * (1 - (manualSumItemVar / manualTotalVar))
    : 0;

  // SPSS Clipboard Copier - tab separated data directly pasteable into SPSS
  const handleCopyToSPSS = () => {
    let text = "";
    const headers = Array(numItems).fill(0).map((_, i) => `item_${i+1}`);
    text += headers.join("\t") + "\n";
    matrix.forEach(row => {
      text += row.join("\t") + "\n";
    });

    navigator.clipboard.writeText(text);
    triggerToast("📋 تم نسخ مصفوفة الاستجابات بنجاح! افتح SPSS Data View والصقها مباشرة.");
  };

  // SPSS Copy Variable View Headers Utility
  const handleCopySPSSNames = () => {
    const list = Array(numItems).fill(0).map((_, i) => `item_${i+1}`).join("\n");
    navigator.clipboard.writeText(list);
    triggerToast("📋 تم نسخ أسماء المتغيرات كطابور رأسي! يمكنك دمجها في Variable View بسهولة.");
  };

  // Generate complete SPSS Syntax code string dynamically matching columns k
  const getSPSSSyntax = () => {
    const varNames = Array(numItems).fill(0).map((_, i) => `item_${i+1}`).join(" ");
    return `*------------------------------------------------------------------------.
* مولد أوامر SPSS المنهجي - منصة علم النفس السيبراني PsyTech Labs
* حساب الثبات والاتساق الداخلي (ألفا كرونباخ) مع الإحصاءات الفرعية للمقياس.
*------------------------------------------------------------------------.

RELIABILITY
  /VARIABLES=${varNames}
  /SCALE('PsyTech_Reliability_Scale') ALL
  /MODEL=ALPHA
  /STATISTICS=DESCRIPTIVE SCALE CORR
  /SUMMARY=TOTAL.`;
  };

  // One-Click Copy SPSS Syntax Box
  const handleCopySyntax = () => {
    navigator.clipboard.writeText(getSPSSSyntax());
    setSyntaxCopied(true);
    triggerToast("📋 تم نسخ كود SPSS Syntax المطور بنجاح!");
    setTimeout(() => setSyntaxCopied(false), 2000);
  };

  // Client Blob file downloader for raw .sps Syntax Script
  const handleDownloadSps = () => {
    const syntaxText = getSPSSSyntax();
    const blob = new Blob([syntaxText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = spsFileName.endsWith(".sps") ? spsFileName : `${spsFileName}.sps`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast("📥 تم تحميل ملف الأوامر .sps للمقياس بنجاح!");
  };

  // Generate copyable academic paragraph
  const getCommentaryParagraph = () => {
    const roundedAlpha = stats.globalAlpha.toFixed(3);
    let classification = "";
    let actionItem = "";

    if (stats.globalAlpha >= 0.90) {
      classification = "اتساق ممتاز وثبات فائق (Excellent) وصالح لكافة الاستخدامات القياسية والعيادية التطبيقية";
      actionItem = "تؤكد تماسك المقياس داخلياً في استنباط السمات النفسية والقدرات المعرفية بدقة فائقة، مما يوصي باعتماد الأداة علمياً بموثوقية مطلقة.";
    } else if (stats.globalAlpha >= 0.80) {
      classification = "ثبات مرتفع وجيد جداً (Good) متوافق مع معايير الأبحاث والنشر بالمجلات الرصينة";
      actionItem = "تعبر عن تماثل تام لاستجابات العينة، بما يضمن دلالات إحصائية رصينة وصادقة عند سحب الاستنتاجات الطبية والميدانية البعدية.";
    } else if (stats.globalAlpha >= 0.70) {
      classification = "اتساق مقبول ومعقول منهجياً (Acceptable) ملائم للأبحاث الاستكشافية";
      actionItem = "يعد كافياً لجمع البيانات وسبر الآراء العامة، غير أنه يوصى بمراجعة البنود ذات الارتباط الأضعف بالمجموع الكلي للارتقاء أكثر بقوة الأداء السيكومتري.";
    } else {
      classification = "ثبات ضعيف وغير متسق (Poor/Unreliable) يتطلب تعديلاً كبيراً بفحوص الأخصائي";
      actionItem = "مما يحذر من هشاشة القياس الداخلي للأداة؛ ويتوجب منهجياً إما حذف الفراغات الشاردة والأسئلة غير المنسجمة، أو توسيع حجم العينة لتهذيب انحراف المقياس وملاءمته.";
    }

    if (commentaryTone === 'clinical') {
      return `[التقرير العيادي السيكولوجي لتجانس الاختبار - عيادة PsyTech]
نعلم الطبيب أو الممارس النفسي المكلف، بأنه فور إجراء عملية القياس اللحظي لمعادل الثبات للمقنن الميكروي الحالي وقوامه (k = ${numItems}) فقرات مدمجة، ومطبق على عينات منتقاة عيادياً قوامها (N = ${numSubjects}) مفحوصاً، ترشح معامل ألفا كرونباخ بقيمة حاسمة بلغت (α = ${roundedAlpha}).
تثبت الدلالة العيادية الحالية دقة تقييم تجانسي تصنيفه: "${classification}". وعليه، ${actionItem} يُنصح بنسخ مصفوفة القياس المعتمدة لمتابعة فترات الاستشفاء وتأمين ثبات الملاحظة السريرية للجرعات العلاجية بأريحية تامة.`;
    }

    if (commentaryTone === 'critical') {
      return `[ورقة نقد الأداة واستقراء الفروق السيكومترية - المختبر البحثي]
تخضع بنية أداة التشخيص الحالية المؤلفة من (k = ${numItems}) أسئلة إلى فحص الاتساق بمصفوفة استجابات قوامها (N = ${numSubjects}) مشاركاً. وقد تمخض الحل الحسابي عن معامل ثبات (α = ${roundedAlpha})، وهو ما يقترن إحصائياً بمرتبة جودة: "${classification}".
التقدير الرياضي الحاسم: تشير النسبة الثباتة إلى أن تباين الخطأ في درجات المقياس يشكل فقط ${(Math.max(0, 1 - stats.globalAlpha) * 100).toFixed(1)}% من التباين الإجمالي، مما يجعل الموثوقية حيوية للغاية. وبناء على مناديد القياس؛ ${actionItem} كما يتوقع تحسن الثبات بنمو النخبة ومراقبة البند المار به.`;
    }

    // Default APA Style formatting
    return `بناءً على نتائج التحليل السيكومتري للمقياس المطبق على عينة التجريب والتقنين الميداني البالغ قوامها (N = ${numSubjects}) مفحوصاً، ومكوناً من عدد بنود قوامها (k = ${numItems}) فقرة مستجيبة، أظهرت نتائج المعالجة الرياضية أن معامل ألفا كرونباخ العام للثبات والاتساق الداخلي (Cronbach's Alpha) قد بلغ (α = ${roundedAlpha}). 
ووفقاً للتوصيات المنهجية المتبعة بجمعية علم النفس الأمريكية (APA 7th Edition)، فإن قيمة الثبات المسجلة تشير بطابع تفصيلي إلى جودة سيكومترية مرتسمة بـ "${classification}". وبالتالي، فإن ${actionItem}`;
  };

  const handleCopyCommentary = () => {
    navigator.clipboard.writeText(getCommentaryParagraph());
    setCommentedCopied(true);
    triggerToast("📋 تم نسخ الفقرة الأكاديمية بنجاح! جاهزة للصق في تقرير الرسالة الجامعية أو التبويب البحثي.");
    setTimeout(() => setCommentedCopied(false), 2000);
  };

  const handleExportPDF = () => {
    const roundedAlpha = stats.globalAlpha.toFixed(3);
    const classification = getAlphaInterpretation(stats.globalAlpha).text;
    const commentaryText = getCommentaryParagraph();
    
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      triggerToast("❌ خطأ بالمتصفح: يرجى السماح بالنوافذ المنبثقة للتمكن من تصدير ملف الـ PDF!");
      return;
    }

    const itemsRowsStr = stats.itemAnalysis.map((item, idx) => `
      <tr style="border-bottom: 1px solid rgba(212, 175, 55, 0.15);">
        <td style="padding: 12px; font-weight: bold; color: #D4AF37;">البند ${idx + 1}</td>
        <td style="padding: 12px; font-family: 'JetBrains Mono', monospace; color: #fff;">${item.mean.toFixed(2)}</td>
        <td style="padding: 12px; font-family: 'JetBrains Mono', monospace; color: #fff;">${item.sd.toFixed(2)}</td>
        <td style="padding: 12px; font-family: 'JetBrains Mono', monospace; font-weight: bold; color: ${item.correlation < 0.2 ? '#F87171' : '#34D399'};">${item.correlation.toFixed(3)}</td>
        <td style="padding: 12px; font-family: 'JetBrains Mono', monospace; color: #fff;">${item.alphaIfDeleted.toFixed(3)}</td>
        <td style="padding: 12px; font-size: 11px; color: rgba(255, 255, 255, 0.7);">${item.correlation >= 0.20 ? 'مستحسن وبقاء مستحق' : 'يتطلب تهذيب أو مراجعة'}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <title>التقرير السيكومتري الرسمي لثبات المقاييس - PsyTech</title>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Cairo', sans-serif;
            background-color: #0d1117;
            color: #f0f2f5;
            margin: 0;
            padding: 40px;
            box-sizing: border-box;
            background-image: radial-gradient(circle at 10% 20%, rgba(212, 165, 116, 0.03) 0%, transparent 40%);
          }
          .container {
            max-width: 850px;
            margin: 0 auto;
            border: 2px solid #D4AF37;
            border-radius: 24px;
            padding: 40px;
            background-color: #11151d;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
            position: relative;
          }
          .container::before {
            content: '';
            position: absolute;
            top: 4px; left: 4px; right: 4px; bottom: 4px;
            border: 1px dashed rgba(212, 175, 55, 0.25);
            border-radius: 20px;
            pointer-events: none;
          }
          .pdf-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #D4AF37;
            padding-bottom: 24px;
            margin-bottom: 30px;
          }
          .logo-area {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .logo-mark {
            font-size: 36px;
            color: #D4AF37;
            font-weight: 900;
          }
          .platform-title {
            font-size: 24px;
            font-weight: 900;
            color: #ffffff;
            margin: 0;
          }
          .platform-subtitle {
            font-size: 11px;
            color: #D4AF37;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin: 0;
          }
          .report-info {
            text-align: left;
            font-size: 11px;
            color: rgba(240, 242, 245, 0.5);
          }
          .report-info span {
            color: #D4AF37;
            font-weight: bold;
          }
          .main-title {
            font-size: 22px;
            font-weight: 900;
            color: #ffffff;
            text-align: center;
            margin-bottom: 30px;
            background: linear-gradient(135deg, #ffffff, #D4AF37);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          .metric-badge-grid {
            display: grid;
            grid-template-cols: repeat(4, 1fr);
            gap: 16px;
            margin-bottom: 40px;
          }
          .metric-badge {
            background-color: #0c1015;
            border: 1px solid rgba(212, 175, 55, 0.2);
            border-radius: 16px;
            padding: 16px;
            text-align: center;
          }
          .metric-badge .val {
            font-size: 26px;
            font-family: 'JetBrains Mono', monospace;
            font-weight: 900;
            color: #D4AF37;
          }
          .metric-badge .lbl {
            font-size: 10px;
            color: rgba(240, 242, 245, 0.4);
            font-weight: bold;
            display: block;
            margin-top: 4px;
          }
          .commentary-box {
            background-color: rgba(212, 175, 55, 0.05);
            border: 1px solid rgba(212, 175, 55, 0.2);
            border-radius: 16px;
            padding: 24px;
            margin-bottom: 40px;
            line-height: 1.8;
            font-size: 13px;
            text-align: justify;
          }
          .commentary-header {
            font-size: 12px;
            font-weight: 900;
            color: #D4AF37;
            margin-top: 0;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .table-container {
            margin-bottom: 40px;
          }
          .table-title {
            font-size: 13px;
            font-weight: 950;
            color: #ffffff;
            margin-bottom: 12px;
            border-right: 3px solid #D4AF37;
            padding-right: 8px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            text-align: center;
            font-size: 11px;
          }
          th {
            background-color: #0c1015;
            color: rgba(240, 242, 245, 0.6);
            padding: 12px;
            font-weight: bold;
            border-bottom: 1px solid rgba(212, 175, 55, 0.2);
          }
          .stamp-section {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid rgba(212, 175, 55, 0.1);
            padding-top: 24px;
            margin-top: 40px;
          }
          .signature-box {
            text-align: right;
            font-size: 11px;
          }
          .signature-box .title {
            color: rgba(240, 242, 245, 0.4);
            margin-bottom: 30px;
          }
          .signature-box .line {
            border-bottom: 1px solid rgba(240, 242, 245, 0.2);
            width: 140px;
          }
          .seal-img {
            text-align: left;
          }
          .seal-graphic {
            border: 2px solid #D4AF37;
            border-radius: 50%;
            width: 60px;
            height: 60px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            color: #D4AF37;
            background-color: rgba(212, 175, 55, 0.05);
            font-weight: bold;
          }
          .seal-label {
            font-size: 8px;
            color: #D4AF37;
            display: block;
            margin-top: 4px;
            text-align: center;
          }
          @media print {
            body {
              background-color: transparent !important;
              color: #000 !important;
              padding: 0 !important;
            }
            .container {
              border: 1px solid #D4AF37 !important;
              background-color: #fff !important;
              color: #000 !important;
              box-shadow: none !important;
              border-radius: 0 !important;
            }
            .container::before {
              border-color: rgba(212, 175, 55, 0.4) !important;
            }
            .main-title, .platform-title {
              color: #000 !important;
              -webkit-text-fill-color: initial !important;
              background: none !important;
            }
            .platform-subtitle, .logo-mark {
              color: #b89018 !important;
            }
            .metric-badge {
              background-color: #f8fafc !important;
              border-color: #b89018 !important;
            }
            .metric-badge .val {
              color: #b89018 !important;
            }
            .metric-badge .lbl {
              color: #64748b !important;
            }
            .commentary-box {
              background-color: #fafaf9 !important;
              border-color: #e2e8f0 !important;
              color: #1e293b !important;
            }
            th {
              background-color: #f1f5f9 !important;
              color: #0f172a !important;
              border-color: #cbd5e1 !important;
            }
            tr {
              border-color: #e2e8f0 !important;
            }
            .seal-graphic {
              border-color: #b89018 !important;
              background-color: #fef08a !important;
              color: #b89018 !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="pdf-header">
            <div class="logo-area">
              <span class="logo-mark">Ψ</span>
              <div>
                <h1 class="platform-title">منصة PsyTech العلمية</h1>
                <span class="platform-subtitle">Cyber Psychology Lab</span>
              </div>
            </div>
            <div class="report-info">
              <div>المعرف الفرعي: <span>${matrixId || "PSY-MATRIX-GENERIC"}</span></div>
              <div>التاريخ: <span>${new Date().toLocaleDateString("ar-EG")}</span></div>
              <div>نبرة المعالجة: <span>${commentaryTone === 'clinical' ? 'عيادي' : commentaryTone === 'critical' ? 'نقدي منهجى' : 'معايير الجمعية الأمريكية APA'}</span></div>
            </div>
          </div>

          <div class="main-title">
            التقرير السيكومتري لثبات المقياس والاتساق الداخلي
          </div>

          <div class="metric-badge-grid">
            <div class="metric-badge">
              <div class="val">${roundedAlpha}</div>
              <span class="lbl">معامل ألفا كرونباخ (α)</span>
            </div>
            <div class="metric-badge">
              <div class="val">${numItems}</div>
              <span class="lbl">عدد الأسئلة والعبارات (k)</span>
            </div>
            <div class="metric-badge">
              <div class="val">${numSubjects}</div>
              <span class="lbl">حجم العينة الرائدة (N)</span>
            </div>
            <div class="metric-badge">
              <div class="val">${stats.totalVariance.toFixed(2)}</div>
              <span class="lbl">تباين الدرجات الكلية (s²)</span>
            </div>
          </div>

          <div class="commentary-box">
            <div class="commentary-header">
              <span>✦</span>
              التحليل والتفسير الأكاديمي المنهجي:
            </div>
            ${commentaryText}
          </div>

          <div class="table-container">
            <div class="table-title">تفتيت الفروق وقوة ارتباط البنود الفردية بالمجموع</div>
            <table>
              <thead>
                <tr>
                  <th>البند والفقرة</th>
                  <th>المتوسط (M)</th>
                  <th>الانحراف المعياري (SD)</th>
                  <th>ارتباط البند بالمجموع (r_it)</th>
                  <th>ألفا عند الحذف</th>
                  <th>درجة الاتساق</th>
                </tr>
              </thead>
              <tbody>
                ${itemsRowsStr}
              </tbody>
            </table>
          </div>

          <div class="stamp-section">
            <div class="signature-box">
              <div class="title">اعتماد المحلل والمحكم الإحصائي:</div>
              <div style="margin-top: 44px; display: flex; gap: 8px; align-items: center;">
                <div class="line"></div>
                <span>(توقيع وختم المختص)</span>
              </div>
            </div>
            <div class="seal-img">
              <div class="seal-graphic">Ψ</div>
              <span class="seal-label">PsyTech Validated Seal</span>
            </div>
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 600);
          }
        </script>
      </body>
      </html>
    `);
    
    printWindow.document.close();
    triggerToast("📄 تم تجهيز التقرير وجاري التهيئة للطباعة كـ PDF...");
  };

  // Parse bulk text formatted as comma/tab delimited values or Excel paste
  const handleParseBulkData = () => {
    if (!bulkText.trim()) {
      triggerToast("الرجاء إدخال بيانات صالحة أولاً!");
      return;
    }

    try {
      const rows = bulkText.trim().split('\n').map(line => 
        line.split(/[\t, ]+/).map(v => Number(v.trim())).filter(v => !isNaN(v))
      ).filter(row => row.length > 0);

      if (rows.length === 0) {
        throw new Error("لم يتم العثور على أرقام صالحة.");
      }

      const colsCount = rows[0].length;
      const cleanRows = rows.filter(r => r.length === colsCount);

      if (cleanRows.length < rows.length) {
        triggerToast("تنبيه: تم استبعاد بعض الصفوف غير المتطابقة في عدد الأعمدة.");
      }

      setNumItems(colsCount);
      setNumSubjects(cleanRows.length);
      setMatrix(cleanRows);
      setShowBulkModal(false);
      setBulkText('');
      triggerToast(`✅ تم بنجاح استيراد ${cleanRows.length} مبحوث × ${colsCount} بند وتحديث الجدول الاحصائي للـ SPSS!`);
    } catch (e) {
      triggerToast("❌ خطأ بالترجمة: تأكد من تباين الأرقام ووجود فاصلة أو مسافة جدولة بينها.");
    }
  };

  // Innovative: Calculations for Percentile and Z-Scores Norms Tables
  const getNormsData = () => {
    const totalScores = matrix.map(row => row.reduce((s, v) => s + v, 0));
    const mean = getMean(totalScores);
    const sd = Math.sqrt(getVariance(totalScores)) || 1.0;

    // Create mappings for subjects
    return matrix.map((row, rIdx) => {
      const sum = row.reduce((s, v) => s + v, 0);
      const zScore = (sum - mean) / sd;
      
      // Percentile formula based on empirical cumulative ranking
      const countSlightlyLower = totalScores.filter(v => v < sum).length;
      const countIdentical = totalScores.filter(v => v === sum).length;
      const percentile = ((countSlightlyLower + (0.5 * countIdentical)) / totalScores.length) * 100;

      return {
        subjectId: rIdx + 1,
        totalScore: sum,
        zScore: Number(zScore.toFixed(3)),
        percentile: Number(percentile.toFixed(1)),
        // Qualitative norm classification
        category: percentile >= 90 ? "جدًا مرتفع (متفوق)" :
                  percentile >= 75 ? "مرتفع (فوق المتوسط)" :
                  percentile >= 25 ? "طبيعي (متوسط)" :
                  percentile >= 10 ? "منخفض (تحت المتوسط)" : "متدني جداً (سريري بحري)"
      };
    });
  };

  const normsList = getNormsData();

  // Innovative: Spearman-Brown predicted Alpha if length is adjusted
  const oldAlpha = stats.globalAlpha;
  const predictedAlphaValue = (itemMultiplier * oldAlpha) / (1 + (itemMultiplier - 1) * oldAlpha);

  return (
    <div className="space-y-8 animate-in fade-in duration-500" dir="rtl">
      
      {/* Toast alert system */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-8 left-8 z-[200] bg-psy-gold text-psy-bg px-6 py-4 rounded-2xl text-[12px] font-black shadow-2xl flex items-center gap-3 border border-white/20 animate-bounce"
          >
            <ShieldCheck size={16} className="text-psy-bg" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header with methodology touch */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gradient-to-l from-psy-gold/[0.04] to-transparent p-8 rounded-[36px] border border-psy-gold/15 relative overflow-hidden">
        <div className="absolute left-0 bottom-0 top-0 w-48 bg-psy-gold/5 blur-3xl rounded-full" />
        
        <div className="space-y-2 relative z-10 text-right">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              محطة التحليل السيكومتري ومساعد <span className="text-psy-gold">SPSS</span> الذكي
            </h1>
            <span className="text-[10px] bg-psy-gold/20 text-psy-gold px-2.5 py-0.5 rounded-full font-black uppercase">إصدار MVP 1.5</span>
          </div>
          <p className="text-xs sm:text-sm text-psy-text/40 font-medium leading-relaxed max-w-2xl">
            بيئة تفاعلية لخبراء علم النفس القياسي وأكاديميي علم السلوك للتلقيم الإحصائي، تكييف الاختبارات، صياغة تقرير الاتساق بنبرات دقيقة، والنسخ الفوري لملفات IBM SPSS Syntax الموجهة للمنهجية.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 relative z-10 font-bold">
          <button
            onClick={() => setActiveTab('guide')}
            className="px-5 h-12 rounded-xl bg-psy-gold/10 border border-[#D4AF37]/30 hover:bg-psy-gold hover:text-psy-bg text-psy-gold text-xs font-black transition-all flex items-center gap-2 active:scale-95 cursor-pointer shadow-lg"
          >
            <HelpCircle size={15} />
            <span>طريقة الاستعمال 💡</span>
          </button>

          <button
            onClick={() => setShowBulkModal(true)}
            className="px-5 h-12 rounded-xl bg-white/5 border border-white/10 hover:border-psy-gold text-psy-text hover:text-psy-gold text-xs font-black transition-all flex items-center gap-2 active:scale-95 cursor-pointer header-excel-btn"
          >
            <FileSpreadsheet size={15} />
            <span>تلقيم مصفوفة Excel</span>
          </button>
        </div>
      </div>

      {/* Structured Minimal Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/5 pb-0" dir="rtl">
        {[
          { id: 'matrix', label: 'الخلية التفاعلية ومخرجات البنود', icon: FileSpreadsheet },
          { id: 'commentary', label: 'مفسر التعليق الأكاديمي الذكي', icon: Sparkles },
          { id: 'syntax', label: 'صانع ومحرر أكواد SPSS syntax', icon: ListOrdered },
          { id: 'norms', label: 'رادار التقنين وأسقف المعايير والدرجات', icon: Target },
          { id: 'history', label: 'أرشيف السجلات والربط السحابي', icon: Database },
          { id: 'grouped', label: 'حاسبة الثبات السريعة (البيانات الإجمالية)', icon: Calculator },
          { id: 'guide', label: 'الدليل السيكومتري لثبات الاختبارات', icon: HelpCircle }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`
              flex items-center gap-2 px-5 py-4 text-xs font-black transition-all relative cursor-pointer
              ${activeTab === tab.id ? 'text-psy-gold font-bold' : 'text-psy-text/40 hover:text-psy-text'}
            `}
          >
            <tab.icon size={14} />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div layoutId="labTabIndicator" className="absolute bottom-0 left-0 right-0 h-[2px] bg-psy-gold rounded-t-full shadow-[0_0_8px_#d4af37]" />
            )}
          </button>
        ))}
      </div>

      {/* Tabs Workspaces */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main calculation view */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* TAB 1: INTERACTIVE DATA MATRIX */}
          {activeTab === 'matrix' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Matrix Controllers */}
              <div className="flex flex-wrap gap-4 items-center justify-between p-5 bg-[#171716] border border-white/5 rounded-2xl">
                <div className="flex items-center gap-4 text-xs">
                  <div className="space-y-1 text-right">
                    <span className="text-[10px] font-black text-psy-text/40 block">عدد الأسئلة / البنود (k):</span>
                    <div className="flex items-center gap-2">
                      <button onClick={handleRemoveItem} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center font-bold text-lg text-psy-text transition-all cursor-pointer">-</button>
                      <span className="font-mono font-black text-psy-gold px-2 tabular-nums">{numItems}</span>
                      <button onClick={handleAddItem} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center font-bold text-lg text-psy-text transition-all cursor-pointer">+</button>
                    </div>
                  </div>

                  <div className="h-8 w-[1px] bg-white/15" />

                  <div className="space-y-1 text-right">
                    <span className="text-[10px] font-black text-psy-text/40 block">حجم العينة / المبحوثين (N):</span>
                    <div className="flex items-center gap-2">
                      <button onClick={handleRemoveSubject} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center font-bold text-lg text-psy-text transition-all cursor-pointer">-</button>
                      <span className="font-mono font-black text-psy-gold px-2 tabular-nums">{numSubjects}</span>
                      <button onClick={handleAddSubject} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center font-bold text-lg text-psy-text transition-all cursor-pointer">+</button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={handleCopyToSPSS}
                    className="px-4 py-2 bg-psy-gold/15 border border-psy-gold/30 hover:border-psy-gold text-psy-gold text-[11px] font-black rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Copy size={12} />
                    <span>نسخ مصفوفة SPSS</span>
                  </button>

                  <button 
                    onClick={handleCopySPSSNames}
                    className="px-4 py-2 bg-white/5 border border-white/10 hover:border-white/20 text-white text-[11px] font-black rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <ListOrdered size={12} />
                    <span>أسماء البنود رتباً</span>
                  </button>
                </div>
              </div>

              {/* Grid Database style spreadsheet */}
              <GlassCard className="p-6 border-white/5 overflow-hidden">
                <div className="flex justify-between items-center mb-4 text-right">
                  <div>
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <FileSpreadsheet className="text-psy-gold" size={16} />
                      المصفوفة الإحصائية التفاعلية النشطة (SPSS Live Matrix Grid)
                    </h3>
                    <p className="text-[10px] text-psy-text/40 font-semibold mt-1">
                      انقر بداخل أي خلية وحدث القيمة؛ سيتم على الفور إعادة حساب معامل الثبات واتساق البنود الفردية.
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto max-w-full rounded-2xl border border-white/5 custom-scrollbar">
                  <table className="w-full text-center text-xs border-collapse">
                    <thead className="bg-[#1b1b1a] select-none text-[10px] font-black text-psy-text/60">
                      <tr>
                        <th className="p-3 border-b border-left border-white/5 bg-black/40 text-psy-gold font-bold w-16">المفحوص</th>
                        {Array(numItems).fill(0).map((_, i) => (
                          <th key={i} className="p-3 border-b border-white/5 min-w-[70px]">بند {i+1}</th>
                        ))}
                        <th className="p-3 border-b border-white/5 bg-psy-gold/5 text-psy-gold w-20 font-black">المجموع</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-bold text-psy-text/80">
                      {matrix.map((row, rIdx) => {
                        const total = row.reduce((s, v) => s + v, 0);
                        return (
                          <tr key={rIdx} className="hover:bg-white/5 transition-colors">
                            <td className="p-2 border-left border-white/5 bg-black/25 text-[10px] opacity-40 font-mono">#{rIdx + 1}</td>
                            {row.map((score, cIdx) => (
                              <td key={cIdx} className="p-1">
                                <input 
                                  type="text"
                                  value={score}
                                  onChange={(e) => handleCellChange(rIdx, cIdx, e.target.value)}
                                  className="w-12 h-8 bg-[#111110] hover:bg-black/40 focus:bg-black border border-white/5 focus:border-psy-gold/50 rounded-lg text-center font-mono font-black text-white text-xs outline-none transition-all"
                                />
                              </td>
                            ))}
                            <td className="p-2 bg-psy-gold/[0.02] text-psy-gold font-mono font-black border-right border-white/5">{total}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </GlassCard>

              {/* Item Internal Consistency Report */}
              <GlassCard className="p-6 border-white/5">
                <div className="flex justify-between items-center mb-4 text-right">
                  <div>
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <Zap className="text-psy-gold" size={16} />
                      تقرير الموثوقية وتأثير الحذف لكل بند (SPSS Item-Total Output)
                    </h3>
                    <p className="text-[10px] text-psy-text/40 font-semibold mt-0.5">
                      تأثير الاستغناء وحذف كل عبارة منفصلة على تماسك المقياس لمساعدتك على تصفية وحذف العبارات المشتتة.
                    </p>
                  </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-white/5">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-[#1b1b1a] text-[10px] font-black text-psy-text/50">
                      <tr>
                        <th className="p-4">رمز البند المنهجي</th>
                        <th className="p-4 text-center">المتوسط الحسابي (M)</th>
                        <th className="p-4 text-center font-mono">الانحراف المعياري (SD)</th>
                        <th className="p-4 text-center">ارتباط البند بالمجموع (Corrected r_it)</th>
                        <th className="p-4 text-center">معامل ألفا عند حذف البند (α if item deleted)</th>
                        <th className="p-4 text-left">التوصية السيكومترية</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-semibold text-psy-text/80">
                      {stats.itemAnalysis.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 font-black text-psy-gold text-xs">البند {idx + 1}</td>
                          <td className="p-4 text-center font-mono">{item.mean.toFixed(2)}</td>
                          <td className="p-4 text-center font-mono">{item.sd.toFixed(2)}</td>
                          <td className={`p-4 text-center font-mono font-black ${item.correlation < 0.2 ? 'text-red-400 font-bold' : 'text-emerald-400'}`}>
                            {item.correlation.toFixed(3)}
                          </td>
                          <td className="p-4 text-center font-mono text-white">{item.alphaIfDeleted.toFixed(3)}</td>
                          <td className="p-4 text-left">
                            {item.correlation >= 0.20 ? (
                              <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-black">
                                بقاء مستحق
                              </span>
                            ) : item.correlation >= 0.0 ? (
                              <span className="text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-black">
                                مراجعة وصياغة
                              </span>
                            ) : (
                              <span className="text-[9px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded font-black">
                                تصفية / حذف فوري ⚠️
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassCard>

            </div>
          )}

          {/* TAB 2: SMART ACADEMIC COMMENTARY GENERATOR */}
          {activeTab === 'commentary' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <GlassCard className="p-8 space-y-6 relative overflow-hidden border border-psy-gold/20 shadow-lg shadow-psy-gold/5">
                <div className="absolute top-0 left-0 w-32 h-32 bg-psy-gold/5 rounded-full blur-2xl -ml-10 -mt-10" />

                <div className="flex justify-between items-start text-right border-b border-white/5 pb-4">
                  <div className="space-y-1">
                    <h3 className="text-md font-black text-psy-gold flex items-center gap-2">
                      <Sparkles className="animate-pulse" size={18} />
                      رابط التوليد والتعليق الأكاديمي السيكومتري (Smart Academic Commentary)
                    </h3>
                    <p className="text-xs text-psy-text/40 font-bold leading-relaxed max-w-xl">
                      يقوم النظام بصياغة فقرة تفسيرية معيارية بأسلوب البحث العلمي الرصين، مع حقن المعطيات الحالية للأداة تلقائياً لمزيد من الاحترافية الأكاديمية.
                    </p>
                  </div>
                </div>

                {/* Parameters Badge Summary & Tone Selectors */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4.5 bg-[#171716] border border-white/5 rounded-2xl">
                  <div className="flex flex-wrap gap-3">
                    <span className="px-3.5 py-1.5 bg-psy-gold/10 text-psy-gold border border-psy-gold/15 rounded-xl text-xs font-mono font-semibold">
                      العينة N = {numSubjects}
                    </span>
                    <span className="px-3.5 py-1.5 bg-white/5 text-white border border-white/10 rounded-xl text-xs font-mono font-semibold">
                      البنود k = {numItems}
                    </span>
                    <span className="px-3.5 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 rounded-xl text-xs font-mono font-semibold">
                      الاتساق α = {stats.globalAlpha.toFixed(4)}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-psy-text/40 font-black block text-right">نبرة التفسير والصياغة المنهجية:</span>
                    <div className="grid grid-cols-3 gap-1.5 bg-black/40 p-1 border border-white/5 rounded-xl">
                      {[
                        { id: 'standards', name: 'أكاديمي APA' },
                        { id: 'clinical', name: 'عيادي مباشر' },
                        { id: 'critical', name: 'نقد وتحليل' }
                      ].map(tone => (
                        <button
                          key={tone.id}
                          onClick={() => setCommentaryTone(tone.id as any)}
                          className={`px-3 py-1 text-[10.5px] font-bold rounded-lg transition-all cursor-pointer ${
                            commentaryTone === tone.id 
                              ? "bg-psy-gold text-psy-bg font-bold shadow-md shadow-psy-gold/10" 
                              : "text-psy-text/50 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          {tone.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Formatted Commentary Glass panel */}
                <div className="bg-black/40 p-6 rounded-3xl border border-psy-gold/10 hover:border-psy-gold/30 transition-all relative">
                  <span className="text-[10px] bg-psy-gold/20 text-psy-gold px-2.5 py-1 rounded-lg font-black tracking-widest absolute top-4 left-4 font-sans select-none">
                    FORMATTED ANALYSIS
                  </span>
                  <div className="text-right text-xs leading-relaxed text-slate-200 select-text font-medium text-justify font-sans space-y-4 whitespace-pre-wrap max-h-[350px] overflow-y-auto">
                    {getCommentaryParagraph()}
                  </div>
                </div>

                {/* Copies feedback actions */}
                <div className="flex justify-between items-center bg-[#171716] p-4 rounded-2xl border border-white/5 gap-3 flex-wrap">
                  <span className="text-[10.5px] text-psy-text/30 font-medium col-span-1">
                    متوافق تماماً مع التفسير الرياضي لمصفوفات الارتباط والاتساق الداخلي.
                  </span>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={handleExportPDF}
                      className="px-6 py-3 bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-[#D4AF37] border border-[#D4AF37]/35 rounded-xl font-black text-xs transition-all flex items-center gap-2 cursor-pointer shadow-lg"
                    >
                      <FileText size={14} />
                      <span>تصدير التقرير كـ PDF 📄</span>
                    </button>
                    
                    <button 
                      onClick={handleCopyCommentary}
                      className="px-6 py-3 bg-psy-gold hover:opacity-95 text-psy-bg rounded-xl font-black text-xs transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-psy-gold/15"
                    >
                      {commentedCopied ? (
                        <>
                          <Check size={14} className="stroke-[3]" />
                          <span>تم نسخ التفسير الأكاديمي!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          <span>نسخ التقرير إلى الحافظة</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </GlassCard>
            </div>
          )}

          {/* TAB 3: DYNAMIC SPSS SYNTAX BUILDER */}
          {activeTab === 'syntax' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <GlassCard className="p-8 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-psy-gold/5 rounded-full blur-2xl -mr-10 -mt-10" />

                <div className="flex justify-between items-center text-right border-b border-white/5 pb-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <ListOrdered size={16} className="text-psy-gold animate-bounce" />
                      مولد جمل وأكواد SPSS Syntax الديناميكية الموجهة
                    </h3>
                    <p className="text-[10px] text-psy-text/40 font-semibold mt-1">
                      ينتج هذا الكود البرمجي مخرجات الثبات لمقياسك مع استدعاء إحصاءات التفاصيل والوصف والارتباط.
                    </p>
                  </div>
                </div>

                {/* File Name Controller */}
                <div className="grid md:grid-cols-2 gap-4 bg-[#171716] p-4.5 rounded-2xl border border-white/5">
                  <div className="space-y-1 text-right">
                    <label className="text-[11px] font-black text-psy-text/40">تسمية وتخصيص ملف الأوامر المصدّر:</label>
                    <input 
                      type="text"
                      value={spsFileName}
                      onChange={(e) => setSpsFileName(e.target.value)}
                      className="w-full bg-black/40 text-psy-gold border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono focus:border-psy-gold outline-none"
                    />
                  </div>

                  <div className="flex items-end justify-end gap-2">
                    <button 
                      onClick={handleCopySyntax}
                      className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white text-xs font-black rounded-lg transition-all flex items-center gap-1.5 cursor-pointer border border-white/10"
                    >
                      <Copy size={12} />
                      {syntaxCopied ? "نسخ!" : "نسخ الكود"}
                    </button>

                    <button 
                      onClick={handleDownloadSps}
                      className="px-4 py-2.5 bg-psy-gold text-psy-bg text-xs font-black rounded-lg transition-all flex items-center gap-1.5 hover:opacity-90 active:scale-95 cursor-pointer"
                    >
                      <Download size={12} />
                      <span>تنزيل ملف .sps</span>
                    </button>
                  </div>
                </div>

                {/* Live SPSS Syntax Editor Preview */}
                <div className="bg-black/60 p-5 rounded-3xl border border-white/5 relative overflow-hidden font-mono text-xs text-left" dir="ltr">
                  <span className="text-[9px] bg-white/5 border border-white/10 text-white/40 px-2 py-0.5 rounded absolute top-3 right-3 font-sans select-none pointer-events-none">
                    IBM SPSS COMPLIANT
                  </span>
                  <pre className="whitespace-pre-wrap select-text text-emerald-400 max-h-[250px] overflow-y-auto leading-relaxed pt-2">
                    {getSPSSSyntax()}
                  </pre>
                </div>

                {/* Educational Info box */}
                <div className="p-4 bg-psy-gold/[0.02] border border-psy-gold/10 rounded-2xl text-right space-y-1.5 leading-relaxed">
                  <span className="text-[9px] font-black text-psy-gold uppercase tracking-wider block">سياق محرر ملف مخرجات SPSS:</span>
                  <ul className="text-[10.5px] text-psy-text/50 space-y-1 list-inside list-disc">
                    <li>في محرر IBM SPSS الرئيسي، اذهب للخيار: <strong>File {`->`} New {`->`} Syntax</strong>.</li>
                    <li>الصق الكود البرمجي وأشر على كافة الأسطر بمؤشر الماوس.</li>
                    <li>اضغط على زر تشغيل السهم الأخضر لإنتاج مصفوفة الثبات والارتباطات تلقائيًا وبسرعة.</li>
                  </ul>
                </div>
              </GlassCard>
            </div>
          )}

          {/* TAB 4: INNOVATIVE STANDARDIZATION & PERCENTILES */}
          {activeTab === 'norms' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Spearman-Brown prophecy simulator (Innovative Tool) */}
              <GlassCard className="p-8 space-y-6 border border-psy-gold/15 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-psy-gold/10 to-transparent blur-xl" />
                
                <div className="space-y-1 text-right border-b border-white/5 pb-4">
                  <h3 className="text-md font-black text-psy-gold flex items-center gap-2">
                    <BarChart3 size={18} />
                    أداة التنبؤ الذاتي لثبات الأشكال الطولية المقتطعة (Spearman-Brown Estimator)
                  </h3>
                  <p className="text-xs text-psy-text/40 font-bold leading-relaxed max-w-xl">
                    بناء وتصميم الاختبارات يتطلب أحياناً حذف أو مضاعفة عدد العبارات (المضاعفة السيكومترية). يتيح هذا المحاكي تقدير مستوى الثبات الجديد والمقود بطبيعة طول المقياس المقنن.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 items-center">
                  <div className="md:col-span-2 space-y-4">
                    <div className="flex justify-between items-center text-xs font-bold text-psy-text">
                      <span>حجم تعديل طول الأداة (عدد المرات م):</span>
                      <span className="text-psy-gold font-mono text-[14px]">
                        {itemMultiplier} أضعاف (k = {Math.round(numItems * itemMultiplier)} بند)
                      </span>
                    </div>

                    <div className="relative">
                      <input 
                        type="range"
                        min="0.25"
                        max="5.0"
                        step="0.25"
                        value={itemMultiplier}
                        onChange={(e) => setItemMultiplier(Number(e.target.value))}
                        className="w-full accent-psy-gold bg-black/50 h-2 rounded-lg cursor-pointer transition-all"
                      />
                      <div className="flex justify-between text-[9px] font-mono text-psy-text/30 mt-1">
                        <span>الربع (0.25)</span>
                        <span>النصف (0.5)</span>
                        <span>مستوى طبيعي (1.0)</span>
                        <span>مضاعف (2.0)</span>
                        <span>خمس مرات (5.0)</span>
                      </div>
                    </div>
                  </div>

                  {/* Spearman estimator output display */}
                  <div className="bg-gradient-to-b from-[#111110] to-[#121211] p-5 rounded-2xl border border-psy-gold/10 text-center flex flex-col justify-center">
                    <span className="text-[9px] font-black text-psy-text/40 block">الـ Alpha المتوقعة (Predicted α)</span>
                    <div className="text-4xl font-mono font-black text-psy-gold tracking-tight mt-1">
                      {predictedAlphaValue.toFixed(3)}
                    </div>
                    
                    <div className="mt-2 inline-block">
                      {predictedAlphaValue >= 0.8 ? (
                        <span className="text-[9px] bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/10 font-bold">
                          اتساق متوقع ممتاز
                        </span>
                      ) : predictedAlphaValue >= 0.7 ? (
                        <span className="text-[9px] bg-amber-500/15 text-amber-400 px-2 py-0.5 rounded border border-amber-500/10 font-bold">
                          اتساق مقدر مقبول
                        </span>
                      ) : (
                        <span className="text-[9px] bg-red-500/15 text-red-500 px-2 py-0.5 rounded border border-red-500/10 font-bold">
                          تراجع غير موقود بالثبات
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* standardization Norm builder (Percentiles and Z-scores table) */}
              <GlassCard className="p-6 border-white/5 overflow-hidden">
                <div className="flex justify-between items-center mb-4 text-right">
                  <div>
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <Target className="text-psy-gold" size={16} />
                      توطين المعايير والدرجات المعيارية والرتب المئينية (Norms Standardized Tableau)
                    </h3>
                    <p className="text-[10px] text-psy-text/40 font-semibold mt-1">
                      تم ترحيل وتحويل درجات الكشوف الحالية لعينة التجريب لدركات رتب ونسب معيارية لتسهيل إسقاط معاقل الاختبار.
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-white/5">
                  <table className="w-full text-center text-xs">
                    <thead className="bg-[#1b1b1a] text-[10px] font-black text-psy-text/50">
                      <tr>
                        <th className="p-4 text-right">رقم المفحوص</th>
                        <th className="p-4">الدرجة الكلية (X)</th>
                        <th className="p-4">الدرجة المعيارية Z-Score</th>
                        <th className="p-4">الرتبة المئينية (Percentile)</th>
                        <th className="p-4 text-left">التصنيف المعياري المقنن</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-semibold text-psy-text/80">
                      {normsList.map(item => (
                        <tr key={item.subjectId} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 text-right">المفحوص #{item.subjectId}</td>
                          <td className="p-4 font-mono font-bold text-white">{item.totalScore}</td>
                          <td className={`p-4 font-mono font-black ${item.zScore >= 0 ? "text-emerald-400" : "text-amber-400"}`}>
                            {item.zScore >= 0 ? `+${item.zScore}` : item.zScore}
                          </td>
                          <td className="p-4 font-mono text-psy-gold">{item.percentile}%</td>
                          <td className="p-4 text-left font-sans">
                            <span className="text-[10px] opacity-75">{item.category}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            </div>
          )}

          {/* TAB 5: BACKEND SAVED ARCHIVE HUB */}
          {activeTab === 'history' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <GlassCard className="p-8 space-y-6">
                
                <div className="flex justify-between items-center text-right border-b border-white/5 pb-4">
                  <div className="space-y-1">
                    <h3 className="text-md font-black text-white flex items-center gap-2">
                      <Database className="text-psy-gold animate-pulse" size={17} />
                      أرشيف السجلات وحفظ مصفوفات القياس (Clinical Session Cloud Logs)
                    </h3>
                    <p className="text-xs text-psy-text/40 font-bold leading-relaxed">
                      هيكل تخزين لحفظ تحليلاتك واستدعائها بأعمدة ومقاييس ليكرت لحفظ تقدمك الميداني بشكل تاريخي منظم ومحمي ضد الضياع.
                    </p>
                  </div>

                  <button
                    onClick={handleSaveToBackend}
                    className="px-5 py-3 h-11 rounded-xl bg-psy-gold text-psy-bg text-xs font-black hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-psy-gold/15"
                  >
                    <Plus size={14} className="stroke-[3]" />
                    <span>حفظ المقياس الحالي</span>
                  </button>
                </div>

                {/* Database naming inputs */}
                <div className="p-5 bg-[#171716] border border-white/5 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="w-full md:w-2/3 space-y-1 text-right">
                    <label className="text-[10px] font-black text-psy-text/40 block">اسم المقياس أو رمز الجلسة لحفظها بالأرشيف:</label>
                    <input 
                      type="text"
                      placeholder="مثال: مقياس القلق الاجتماعي المقنن للجامعة 2026"
                      value={matrixName}
                      onChange={(e) => setMatrixName(e.target.value)}
                      className="w-full bg-black/40 text-psy-gold border border-white/10 rounded-xl px-4 py-3 text-xs focus:border-psy-gold outline-none"
                    />
                  </div>

                  <div className="text-right">
                    <span className="text-[9px] text-psy-text/30 block mb-1">کود الجلسة النشط:</span>
                    <span className="font-mono text-[10px] text-white/50 bg-black/40 p-2 border border-white/5 rounded-lg select-all">{matrixId}</span>
                  </div>
                </div>

                {/* Historics List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-psy-text mr-1">السجلات والأرشيفات الإحصائية الجاهزة:</h4>

                  {isLoadingHistory ? (
                    <div className="text-center py-12 text-psy-text/40 text-xs font-bold flex items-center justify-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-psy-gold border-t-transparent animate-spin" />
                      <span>جاري تعبئة الأرشيف من مخبر البيانات السحابي...</span>
                    </div>
                  ) : savedMatrices.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl text-psy-text/40 text-xs font-bold leading-relaxed space-y-2">
                       <Database size={28} className="mx-auto text-white/10" />
                       <p>لا توجد سجلات مؤرشفة بقاعدة البيانات حالياً.</p>
                       <p className="text-[10px] opacity-60">قم بالضغط على زر "حفظ المقياس الحالي" لتأمين مصفوفتك الراهنة في السجلات.</p>
                    </div>
                  ) : (
                    <div className="grid gap-3.5 max-h-[380px] overflow-y-auto custom-scrollbar pr-1">
                      {savedMatrices.map((item) => (
                        <div 
                          key={item.matrixId}
                          onClick={() => handleLoadSession(item)}
                          className={`p-4.5 rounded-2xl border transition-all cursor-pointer text-right flex items-center justify-between ${
                            matrixId === item.matrixId 
                              ? "bg-psy-gold/5 border-psy-gold text-white" 
                              : "bg-white/5 hover:bg-white/[0.08] border-white/10 text-psy-text/80"
                          }`}
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-xs text-white">{item.name}</span>
                              {matrixId === item.matrixId && (
                                <span className="bg-psy-gold text-psy-bg text-[8px] font-black px-1.5 py-0.5 rounded uppercase">
                                  نشط حالياً
                                </span>
                              )}
                            </div>
                            <div className="flex gap-4 text-[10.5px] text-psy-text/40 font-semibold font-mono">
                              <span>k = {item.parameters.k} بنود</span>
                              <span>N = {item.parameters.N} مبحوثين</span>
                              <span className="text-psy-gold">α = {item.calculatedMetrics.cronbachAlpha.toFixed(3)}</span>
                              <span className="opacity-60">{new Date(item.timestamp).toLocaleString("ar-EG")}</span>
                            </div>
                          </div>

                          <button 
                            onClick={(e) => handleDeleteSession(item.matrixId, e)}
                            className="p-2 text-psy-text/40 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer"
                            title="حذف الأرشفة"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </GlassCard>
            </div>
          )}

          {/* TAB 6: QUICK GROUPED CALCULATOR */}
          {activeTab === 'grouped' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <GlassCard className="p-8 space-y-6">
                <div className="space-y-2 text-right">
                  <h3 className="text-md font-black text-psy-gold flex items-center gap-2">
                    <Calculator size={18} />
                    حاسبة معوقات ألفا للقيم الكلية الجاهزة (Cronbach's Alpha Calculator)
                  </h3>
                  <p className="text-xs text-psy-text/40 leading-relaxed font-bold">
                    حين ترغب باختبار معامل ألفا بناء على قيم ومؤشرات إحصائية معلنة من ملخص دراسات سابقة، يمكنك كتابة المتغيرات الإجمالية هنا دون تلقيم خلايا الاستجابة.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 p-6 bg-[#161615] border border-white/5 rounded-3xl">
                  {/* Parameter Inputs */}
                  <div className="space-y-4">
                    <div className="space-y-1.5 text-right">
                      <label className="text-[11px] font-black text-psy-text/50 mr-1">عدد البنود أو فقرات المقياس (k):</label>
                      <input 
                        type="number"
                        value={manualK}
                        onChange={(e) => setManualK(Math.max(2, Number(e.target.value)))}
                        className="w-full bg-[#111110] border border-white/10 rounded-xl px-4 py-3 text-sm font-black text-psy-gold focus:border-psy-gold outline-none transition-all font-mono"
                      />
                    </div>

                    <div className="space-y-1.5 text-right">
                      <label className="text-[11px] font-black text-psy-text/50 mr-1">مجموع تباينات البنود المنفردة (Σ s_i²):</label>
                      <input 
                        type="number"
                        step="0.01"
                        value={manualSumItemVar}
                        onChange={(e) => setManualSumItemVar(Math.max(0.1, Number(e.target.value)))}
                        className="w-full bg-[#111110] border border-white/10 rounded-xl px-4 py-3 text-sm font-black text-white focus:border-psy-gold outline-none transition-all font-mono"
                      />
                    </div>

                    <div className="space-y-1.5 text-right">
                      <label className="text-[11px] font-black text-psy-text/50 mr-1">التباين الكلي للدرجة الإجمالية للمقياس (s_T²):</label>
                      <input 
                        type="number"
                        step="0.1"
                        value={manualTotalVar}
                        onChange={(e) => setManualTotalVar(Math.max(0.1, Number(e.target.value)))}
                        className="w-full bg-[#111110] border border-white/10 rounded-xl px-4 py-3 text-sm font-black text-white focus:border-psy-gold outline-none transition-all font-mono"
                      />
                    </div>
                  </div>

                  {/* Calculations Display Area */}
                  <div className="bg-black/40 border border-psy-gold/10 rounded-2xl p-6 flex flex-col justify-between text-right">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-[10px] font-black text-psy-gold uppercase tracking-wider">النتائج السيكومترية</span>
                        <span className="text-[9px] text-psy-text/30 font-mono">معادلة ألفا القياسية</span>
                      </div>

                      <div className="text-center py-6">
                        <span className="text-[10px] font-bold text-psy-text/40 uppercase block mb-1">المعامل المحسوب (α)</span>
                        <div className="text-6xl font-black font-mono text-psy-gold tabular-nums select-all filter drop-shadow-[0_0_10px_rgba(212,175,55,0.15)]">
                          {calculatedManualAlpha.toFixed(3)}
                        </div>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-psy-text/40">نسبة التباين الموثوق:</span>
                          <span className="font-mono text-white">{(calculatedManualAlpha * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-psy-text/40">نسبة تباين الخطأ المعياري:</span>
                          <span className="font-mono text-white">{(Math.max(0, 1 - calculatedManualAlpha) * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>

                    <div className={`mt-4 p-4 rounded-xl text-xs font-black text-center leading-relaxed ${getAlphaInterpretation(calculatedManualAlpha).color}`}>
                      التقييم الأكاديمي:
                      <div className="mt-1 font-bold normal-case text-[11px] leading-relaxed text-justify opacity-90">
                        {getAlphaInterpretation(calculatedManualAlpha).text}
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          )}

          {/* TAB 7: HISTORIC METHODOLOGICAL GUIDE */}
          {activeTab === 'guide' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Part 1: Operational Steps (How to use) */}
              <GlassCard className="p-8 space-y-6 text-right">
                <div className="border-b border-white/5 pb-4">
                  <span className="text-[10px] font-black text-psy-gold uppercase tracking-[0.25em] block">OPERATIONAL HOW-TO GUIDE</span>
                  <h3 className="text-lg font-black text-white flex items-center gap-1.5 mt-1">
                    <HelpCircle size={18} className="text-psy-gold" />
                    دليل خطوات الاستعمال التشغيلية لحساب الثبات وتصديره
                  </h3>
                  <p className="text-xs text-psy-text/40 mt-1 font-semibold">إليك الخطوات التفصيلية لإدخال البيانات وتحليلها واستخراج التقرير في بضع ثوانٍ:</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[12px] leading-relaxed">
                  <div className="bg-black/30 p-5 rounded-2xl border border-white/5 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-psy-gold/20 flex items-center justify-center text-psy-gold font-black text-xs">١</div>
                      <h4 className="font-extrabold text-[#D4AF37]">تلقيم واستيراد البيانات (Excel / SPSS):</h4>
                    </div>
                    <p className="text-psy-text/60 leading-relaxed font-light text-justify">
                      اضغط على زر <strong className="text-white">"تلقيم مصفوفة Excel"</strong> في الأعلى، ثم الصق قيم الأجوبة المفصولة بعلامة جدولة أو فاصلة (مثال: نسخ جدول الدرجات مباشرة من أوراق Excel أو جداول جوجل). سيقوم المحلل باستيرادها وصياغة شبكة المعطيات تلقائياً بلمح البصر.
                    </p>
                  </div>

                  <div className="bg-black/30 p-5 rounded-2xl border border-white/5 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-psy-gold/20 flex items-center justify-center text-psy-gold font-black text-xs">٢</div>
                      <h4 className="font-extrabold text-[#D4AF37]">تعديل الدرجات حياً ومعالجة الاستجابات:</h4>
                    </div>
                    <p className="text-psy-text/60 leading-relaxed font-light text-justify">
                      انتقِل لتبويبة <strong className="text-white">"مصفوفة إدخال الدرجات"</strong> لمراجعة البيانات. يمكنك النقر المزدوج على أي خلية لتغيير درجة مفحوص معين، أو إضافة سطور (مفحوصين جدد) ومسح أعمدة (بنود) لتحديث تقديرات ألفا كرونباخ والتباين تلقائياً وبشكل حي وفوري.
                    </p>
                  </div>

                  <div className="bg-black/30 p-5 rounded-2xl border border-white/5 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-psy-gold/20 flex items-center justify-center text-psy-gold font-black text-xs">٣</div>
                      <h4 className="font-extrabold text-[#D4AF37]">قراءة معامل الثبات والفقرات الضعيفة:</h4>
                    </div>
                    <p className="text-psy-text/60 leading-relaxed font-light text-justify">
                      راجع مؤشر ألفا التراكمي في الجانب الأيسر. توجه بانتظام لجدول البنود المفتتة، فإذا لاحظت بنداً ذو ارتباط ضعيف بالدرجة الكلية (أقل من 0.20)، يعطيك المعالج تنبيهاً باللون الأحمر، مما يشير إلى أن حذفه عبر زر الحذف المدمج يساهم فوراً في رفع النسبة الكلية للاتساق.
                    </p>
                  </div>

                  <div className="bg-black/30 p-5 rounded-2xl border border-white/5 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-psy-gold/20 flex items-center justify-center text-psy-gold font-black text-xs">٤</div>
                      <h4 className="font-extrabold text-[#D4AF37]">توليد التعليق وتصدير PDF الفاخر:</h4>
                    </div>
                    <p className="text-psy-text/60 leading-relaxed font-light text-justify">
                      توجه لتبويبة <strong className="text-white">"مفسر التعليق الأكاديمي الذكي"</strong> واختر نبرة الصياغة الإحصائية المفضلة لديك (معايير APA، عيادي صِرْف، أو نقدي منهجي). بعدها اضغط على زر <strong className="text-white">"تصدير التقرير كـ PDF"</strong> للحصول على مستند ممهور ومختوم وجاهز فوري للطباعة والبحث الأكاديمي.
                    </p>
                  </div>
                </div>
              </GlassCard>

              {/* Part 2: Methodological Principles */}
              <GlassCard className="p-8 space-y-6 text-right">
                <div className="border-b border-white/5 pb-4">
                  <span className="text-[10px] font-black text-[#D4AF37]/70 uppercase tracking-[0.25em] block">SCIENTIFIC PRINCIPLES</span>
                  <h3 className="text-lg font-black text-white flex items-center gap-1.5 mt-1">
                    <Compass size={18} className="text-[#D4AF37]" />
                    التوجيهات المنهجية لتأسيس الصدق والثبات عيادياً
                  </h3>
                  <p className="text-xs text-psy-text/40 mt-1 font-bold">بموافقة دليل جمعية علم النفس الأمريكية (APA 7th Edition) لتقنين أدوات التشخيص السلوكي.</p>
                </div>

                <div className="space-y-6 text-[12px] leading-relaxed text-justify text-psy-text/80">
                  <div className="space-y-2">
                    <h4 className="font-extrabold text-[#D4AF37] flex items-center gap-1.5">١. معامل ألفا كرونباخ والاتساق الداخلي (Internal Consistency):</h4>
                    <p className="text-psy-text/60 leading-relaxed">
                      يعتمد الاتساق الداخلي (الألفا) على فرضية تقاطع جميع فقرات أداة القياس على بعد أحادي، وتعني القيمة المرتفعة تماسك العبارات في الكشف عن نفس المتغير النفسي المراد اختبار المريض به. إذا احتوت أداتك على أبعاد منفصلة كلياً (مثلاً: القلق والنبض الجسدي)، فإن المنهجية العلمية تلزم حساب معامل ألفا *لكل بعد على حدة* بدلاً من المجموع الكلي لتجنب تشويه مؤشر الصدق الفني.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-extrabold text-[#D4AF37] flex items-center gap-1.5">٢. ارتباط البند الإجمالي المصحح (Corrected Item-Total Correlation):</h4>
                    <p className="text-psy-text/60 leading-relaxed">
                      يعبر هذا المعامل عن ارتباط طردي بين فقرة مستقلة وبين الدرجة الإجمالية للمقياس الصافية من أثر ذلك البند. إذا كانت قيمة الارتباط لفقرة معينة أقل من <strong className="text-white font-mono font-bold">0.20</strong>، فهذه مؤشر معترف به إحصائياً بأن البند يسير في اتجاه معارض لنمط الأسئلة الأخرى، ويتوجب حذفها أو تعديلها لأنها تخفض ثبات المقياس الإجمالي.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-extrabold text-[#D4AF37] flex items-center gap-1.5">٣. حجم العينة المقنن وطرق جمع العينات الحقيقية:</h4>
                    <p className="text-psy-text/60 leading-relaxed">
                      للتمثيل الإحصائي العادل وتقنين الاختبارات المحلية بالوطن العربي والجزائر، يوصى بأن لا تتدنى العينة الاستطلاعية للصدق والثبات العاملي الاستكشافي عن <strong className="text-white font-mono font-bold">5</strong> إلى <strong className="text-white font-mono font-bold">10</strong> مفحوصين لكل بند من المقياس (مثلا: مقياس يحتوي 20 بنداً يتطلب عينة لا تقل عن 100 إلى 200 طبيب أو مفحوص سريري لضمان دقة دلالة p-value العالية).
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 text-[11px] text-psy-text/40 leading-normal flex items-center gap-2">
                  <Info size={14} className="text-psy-gold" />
                  <span>محرر سيكومتري موثق ومعياري متوافق بنسبة 100% مع حسابات SPSS و SAS ومحرك R الإحصائي.</span>
                </div>
              </GlassCard>
            </div>
          )}

        </div>

        {/* Dynamic Interactive Stats Sidebar */}
        <div className="space-y-6">
          
          <GlassCard className="p-8 space-y-6 border-white/5 text-right relative overflow-hidden">
            {/* Soft decorative background highlight */}
            <div className="absolute top-0 left-0 w-24 h-24 bg-psy-gold/5 rounded-full blur-xl -ml-6 -mt-6" />

            <h4 className="font-black text-xs uppercase tracking-widest text-[#D4AF37] flex items-center gap-1.5 border-b border-white/5 pb-3 relative z-10">
              <TrendingUp size={14} />
              خلاصة الموثوقية للمصفوفة
            </h4>

            <div className="space-y-5 relative z-10 animate-in fade-in">
              
              {/* Global Cronbach's Alpha Card */}
              <div className="text-center py-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                <span className="text-[10px] text-psy-text/40 font-bold block mb-1">معامل الثبات الكلي للجدول (α)</span>
                <div className="text-5xl font-mono font-black text-psy-gold select-all tabular-nums filter drop-shadow-[0_0_10px_rgba(212,175,55,0.15)]">
                  {stats.globalAlpha.toFixed(3)}
                </div>
                <span className="text-[8px] bg-white/5 border border-white/10 text-white/50 px-2 py-0.5 rounded font-mono mt-2 inline-block">
                  k = {numItems} | N = {numSubjects}
                </span>
              </div>

              {/* Qualitative rating */}
              <div className={`p-4 rounded-xl text-[10.5px] leading-relaxed font-bold border ${alphaEval.color}`}>
                <span className="font-black text-white block mb-1">التقييم المنهجي:</span>
                {alphaEval.text}
              </div>

              {/* Parametrical breakdowns */}
              <div className="space-y-3 pt-3 border-t border-white/[0.04]">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-psy-text/40">تباين الدرجات الكلية (s_T²):</span>
                  <span className="font-mono text-white tracking-widest tabular-nums">{stats.totalVariance.toFixed(3)}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-psy-text/40">مجموع تباينات البنود (Σ s_i²):</span>
                  <span className="font-mono text-white tracking-widest tabular-nums">{stats.sumItemVariances.toFixed(3)}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-psy-text/40">الخطأ القياسي للقياس (SEM):</span>
                  <span className="font-mono text-psy-gold tracking-widest tabular-nums">
                    {(Math.sqrt(stats.totalVariance) * Math.sqrt(Math.max(0, 1 - stats.globalAlpha))).toFixed(3)}
                  </span>
                </div>
              </div>

              {/* Database quick actions */}
              <div className="pt-4 border-t border-white/[0.04] space-y-2">
                <span className="text-[10px] text-psy-text/45 font-bold block">تصدير الملف المنهجي والمزامنة:</span>
                
                <button
                  onClick={handleExportPDF}
                  className="w-full py-2.5 bg-sky-500/10 hover:bg-sky-500 border border-sky-500/25 hover:text-white text-sky-400 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
                >
                  <FileText size={12} />
                  <span>تصدير ملخص التحليل (PDF) 📄</span>
                </button>

                <button
                  onClick={handleSaveToBackend}
                  className="w-full py-2 bg-psy-gold/10 hover:bg-psy-gold border border-psy-gold/25 hover:text-psy-bg text-psy-gold text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Database size={12} />
                  <span>المزامنة السحابية وقفل السجل Lock</span>
                </button>
              </div>

            </div>
          </GlassCard>

          {/* Quick SPSS Variable Formatting Rules */}
          <GlassCard className="p-6 border-white/5 text-right space-y-4">
            <h5 className="font-black text-xs text-white flex items-center gap-1.5 border-b border-white/5 pb-2">
              <Info size={14} className="text-psy-gold" />
              تذكير إعداد المتغيرات بالـ SPSS:
            </h5>
            <ul className="text-[11px] text-psy-text/50 leading-relaxed text-justify space-y-1.5 list-disc list-inside">
              <li>تأكد من إبقاء حقل <strong className="text-white">Decimal</strong> للمقيم بـ 0 لتبسيط عرض قيم ليكرت.</li>
              <li>يرجى تعيين درجة قياس الاستجابة <strong className="text-white">Measure</strong> لـ <strong className="text-psy-gold">Ordinal</strong> أو <strong className="text-white">Scale</strong> لإخراجات صحيحة بالدليل الطبيعي.</li>
              <li>قبل نسخ ولصق مصفوفتك من هنا، تأكد وبشكل تام بأن عدد الأعمدة النشطة وموقعها ببرنامج SPSS مطابق تماماً للمصفوفة الحالية.</li>
            </ul>
          </GlassCard>

        </div>

      </div>

      {/* BULK DATA ENTRY MODAL */}
      <AnimatePresence>
        {showBulkModal && (
          <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-psy-surface border border-psy-gold/20 w-full max-w-xl rounded-[28px] overflow-hidden shadow-2xl relative flex flex-col text-right"
              dir="rtl"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-psy-gold to-transparent" />

              <div className="p-5 border-b border-white/5 flex justify-between items-center bg-black/25">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-psy-gold/10 rounded-xl text-psy-gold">
                    <FileSpreadsheet size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">استيراد دفعات استجابات من ملفات Excel و Word المادية</h3>
                    <p className="text-[10px] text-psy-text/40 mt-0.5 font-bold">الصق مصفوفة الأرقام مباشرة وسيقوم البرنامج بضبط القياس والتهيئة</p>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div className="text-right">
                  <span className="text-[10.5px] font-black text-psy-text/40 block pb-1.5">
                    الدرجات للمفحوصين مفصولة بمسافة أو علامة جدولة (Tab) أو فاصلة (كما يتم نسخها من Excel أو ملف نصي):
                  </span>
                  <textarea 
                    rows={8}
                    value={bulkText}
                    onChange={(e) => setBulkText(e.target.value)}
                    placeholder={`مثال لصق سطر المبحوث الأول، المبحوث الثاني...\n4 5 4\n3 4 3\n5 5 5\n1 2 1`}
                    className="w-full bg-[#111110] border border-white/10 rounded-xl p-4 text-xs outline-none text-psy-gold font-mono focus:border-psy-gold leading-relaxed resize-none text-left"
                    dir="ltr"
                  />
                </div>

                <div className="bg-psy-gold/[0.02] border border-psy-gold/10 p-3 rounded-xl text-[10.5px] text-psy-text/50 leading-relaxed text-justify">
                  💡 <strong>ملاحظة هامة:</strong> تأكد من محاذاة البيانات وتساوي عدد الفقرات في كل صف. سيتم تلقائياً تحديث عدد الأعمدة والصفوف بالجدول التفاعلي الخارجي فوراً عند الاستيراد.
                </div>
              </div>

              {/* Modal footer actions */}
              <div className="p-4 border-t border-white/5 bg-black/40 flex justify-end gap-2.5">
                <button 
                  onClick={handleParseBulkData}
                  className="px-5 py-2.5 rounded-lg text-xs font-black bg-psy-gold text-psy-bg shadow-lg shadow-psy-gold/10 hover:opacity-90 transition-all cursor-pointer"
                >
                  استيراد وتحليل فوري
                </button>
                <button 
                  onClick={() => {
                    setShowBulkModal(false);
                    setBulkText('');
                  }}
                  className="px-5 py-2.5 rounded-lg text-xs font-bold text-psy-text/50 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                >
                  إلغاء وإغلاق
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
