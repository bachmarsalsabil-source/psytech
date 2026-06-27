import{j as e,A as be,m as ee}from"./motion-CZSGZ28n.js";import{r as i}from"./react-vendor-DRKrj2aw.js";import{G as f}from"./GlassCard-W2e82opP.js";import{aL as qe,b9 as te,ba as O,k as ge,bb as se,aB as fe,D as G,a5 as ue,aw as ae,ar as He,_ as ye,r as We,aA as Ke,N as Ze,ap as Qe,T as et,bc as tt,aS as je,s as st}from"./icons-CTnU1jCu.js";import{L as at}from"./LabBackButton-C6LxvZ5_.js";import"./charts-BYPn2mbt.js";import"./index-BhA5I8eX.js";import"./layout-2DCRxxKv.js";import"./toast-DCXCfoeE.js";const F=d=>d.length?d.reduce((u,y)=>u+y,0)/d.length:0,J=d=>{const u=d.length;if(u<=1)return 0;const y=F(d);return d.reduce((v,g)=>v+Math.pow(g-y,2),0)/(u-1)},lt=(d,u)=>{const y=d.length;if(y<=1)return 0;const v=F(d),g=F(u);let D=0,w=0,k=0;for(let x=0;x<y;x++){const j=d[x]-v,r=u[x]-g;D+=j*r,w+=j*j,k+=r*r}return w&&k?D/Math.sqrt(w*k):0},rt=()=>{const[d,u]=i.useState("matrix"),[y,v]=i.useState(null),[g,D]=i.useState(()=>{const t=localStorage.getItem("psytech_matrix_id");if(t)return t;const s="matrix_"+Math.random().toString(36).substring(2,11);return localStorage.setItem("psytech_matrix_id",s),s}),[w,k]=i.useState(""),[x,j]=i.useState(()=>{const t=localStorage.getItem("psytech_matrix_grid");if(t)try{const s=JSON.parse(t);if(Array.isArray(s)&&s.length>0&&Array.isArray(s[0]))return s}catch(s){console.error("Failed to parse saved matrix grid",s)}return[[5,5,4,5,5,4],[4,4,3,4,4,3],[5,5,5,5,5,5],[3,3,2,3,3,2],[4,4,4,4,4,4],[4,3,3,4,4,3],[5,5,4,5,5,5],[4,4,4,4,4,4],[2,2,1,2,2,1],[5,4,5,5,4,5]]}),[r,$]=i.useState(()=>{var t;return((t=x[0])==null?void 0:t.length)||6}),[m,_]=i.useState(()=>x.length||10),[T,Ne]=i.useState("standards"),[ve,le]=i.useState(!1),[E,we]=i.useState("psytech_reliability_analysis.sps"),[ke,re]=i.useState(!1),[M,Se]=i.useState(2),[oe,Ae]=i.useState([]),[Ce,ne]=i.useState(!1),[Y,U]=i.useState(""),[Fe,X]=i.useState(!1),[L,De]=i.useState(10),[ie,Te]=i.useState(4.2),[q,Me]=i.useState(15.8),o=t=>{v(t),setTimeout(()=>v(null),3500)};i.useEffect(()=>{localStorage.setItem("psytech_matrix_grid",JSON.stringify(x)),localStorage.setItem("psytech_matrix_id",g)},[x,g]),i.useEffect(()=>{j(t=>{let s=[...t];if(s.length<m)for(;s.length<m;){const a=Array(r).fill(0).map(()=>Math.floor(Math.random()*3)+3);s.push(a)}else s.length>m&&(s=s.slice(0,m));return s=s.map(a=>{let l=[...a];if(l.length<r)for(;l.length<r;)l.push(Math.floor(Math.random()*3)+3);else l.length>r&&(l=l.slice(0,r));return l}),s})},[r,m]);const H=async()=>{try{ne(!0);const t=await fetch("/api/psychometrics/history");if(t.ok){const s=await t.json();Ae(s)}}catch(t){console.error("Error loading server matrix database logs",t)}finally{ne(!1)}};i.useEffect(()=>{H()},[]);const de=async()=>{if(m<=0||r<=0){o("❌ خطأ بالتحقق: يرجى إدخال أبعاد مصفوفة صالحة (N > 0 & k > 0)");return}try{const t=ce().globalAlpha,s={matrixId:g,name:w.trim()||`تحليل موثوقية المقنن النظري (${r} بند) - ${new Date().toLocaleDateString("ar-EG")}`,timestamp:new Date().toISOString(),parameters:{k:r,N:m},calculatedMetrics:{cronbachAlpha:Number(t.toFixed(4))},variables:Array(r).fill(0).map((l,n)=>`item_${n+1}`),matrix:x};(await fetch("/api/psychometrics/save",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)})).ok?(o("💾 تم الحفظ والمزامنة بقاعدة السجلات الإحصائية السحابية بنجاح!"),H()):o("❌ فشل الخادم في معالجة طلب الحفظ التاريخي.")}catch(t){console.error(t),o("❌ خطأ بالاتصال: تعذر الربط السحابي بقاعدة البيانات.")}},Pe=async(t,s)=>{s.stopPropagation();try{(await fetch(`/api/psychometrics/${t}`,{method:"DELETE"})).ok?(o("🗑️ تم إزالة السجل ومسح أرشفته بنجاح."),H(),g===t&&D("matrix_"+Math.random().toString(36).substring(2,11))):o("❌ فشل حذف السجل من الخادم.")}catch(a){console.error(a),o("❌ خطأ في الاتصال بالشبكة لطلب الحذف.")}},ze=t=>{D(t.matrixId),k(t.name),j(t.matrix),$(t.parameters.k),_(t.parameters.N),u("matrix"),o("⚡ تم تفعيل واستدعاء السجل الإحصائي: "+t.name)},Ie=(t,s,a)=>{const l=Math.min(Math.max(Number(a)||0,0),100);j(n=>{const h=n.map(S=>[...S]);return h[t][s]=l,h})},$e=()=>{if(r>=40){o("الحد الأقصى للتحليل اليدوي السريع هو 40 بنداً للحفاظ على سلاسة الواجهة.");return}$(t=>t+1),o("تمت إضافة عمود بند جديد بنجاح.")},_e=()=>{if(r<=2){o("لابد من توفر بندين على الأقل لإجراء تحليل الثبات والاتساق.");return}$(t=>t-1),o("تم حذف البند الأخير.")},Ee=()=>{if(m>=100){o("للتحليلات الأكبر من 100 مبحوث، يُفضل استخدام SPSS مباشرة.");return}_(t=>t+1),o("تمت إضافة مبحوث جديد.")},Le=()=>{if(m<=3){o("الحد الأدنى لعينات الموثوقية اليدوية هو 3 مبحوثين.");return}_(t=>t-1),o("تم حذف المبحوث الأخير.")},ce=()=>{const t=x.map(b=>b.reduce((c,N)=>c+N,0)),s=J(t),a=F(t),l=[],n=[],h=[];for(let b=0;b<r;b++){const c=x.map(R=>R[b]),N=F(c),z=J(c);n.push(N),l.push(z),h.push(Math.sqrt(z))}const S=l.reduce((b,c)=>b+c,0);let A=0;r>1&&s>0&&(A=r/(r-1)*(1-S/s)),A<0&&(A=0);const Q=Array(r).fill(0).map((b,c)=>{const N=x.map(C=>C[c]),z=x.map((C,I)=>t[I]-C[c]),R=lt(N,z),Ue=l.filter((C,I)=>I!==c).reduce((C,I)=>C+I,0),he=J(z);let B=0;r>2&&he>0&&(B=(r-1)/(r-2)*(1-Ue/he)),B<0&&(B=0);const Xe=R>=.2;return{id:`Item_${c+1}`,mean:n[c],sd:h[c],correlation:R,alphaIfDeleted:B,acceptable:Xe}});return{rowTotals:t,meanTotal:a,totalVariance:s,itemVariances:l,sumItemVariances:S,globalAlpha:A,itemAnalysis:Q}},p=ce(),V=t=>t>=.9?{text:"ممتاز وثبات فائق (Excellent) - صالح لجميع أغراض الترخيص، صناعة التشخيصات النفسية، والقرارات العيادية والمصيرية.",color:"text-emerald-400 bg-emerald-500/10 border-emerald-500/20"}:t>=.8?{text:"جيد وثبات مرتفع (Good) - ثبات رصين يطابق معايير النشر والأبحاث الجامعية الرائدة بامتياز.",color:"text-teal-400 bg-teal-500/10 border-teal-500/20"}:t>=.7?{text:"مقبول منهجيًا وصالح للبحوث الاستكشافية (Acceptable) - مستوفٍ للحد الأدنى من التجانس السيكولوجي السلوكي المعتمد.",color:"text-amber-400 bg-amber-500/10 border-amber-500/20"}:{text:"ضعيف وغير مريح سيكومتريًا (Weak/Unreliable) - مستويات ثبات منخفضة غير صالحة للنشر؛ تقتضي تهذيب صياغات الأسئلة ذات الارتباط السالب والمحتوى غير الدقيق.",color:"text-red-400 bg-red-500/10 border-red-500/20"},xe=V(p.globalAlpha),P=L>1&&q>0?L/(L-1)*(1-ie/q):0,Ve=()=>{let t="";const s=Array(r).fill(0).map((a,l)=>`item_${l+1}`);t+=s.join("	")+`
`,x.forEach(a=>{t+=a.join("	")+`
`}),navigator.clipboard.writeText(t),o("📋 تم نسخ مصفوفة الاستجابات بنجاح! افتح SPSS Data View والصقها مباشرة.")},Re=()=>{const t=Array(r).fill(0).map((s,a)=>`item_${a+1}`).join(`
`);navigator.clipboard.writeText(t),o("📋 تم نسخ أسماء المتغيرات كطابور رأسي! يمكنك دمجها في Variable View بسهولة.")},W=()=>`*------------------------------------------------------------------------.
* مولد أوامر SPSS المنهجي - منصة علم النفس السيبراني PsyTech Labs
* حساب الثبات والاتساق الداخلي (ألفا كرونباخ) مع الإحصاءات الفرعية للمقياس.
*------------------------------------------------------------------------.

RELIABILITY
  /VARIABLES=${Array(r).fill(0).map((s,a)=>`item_${a+1}`).join(" ")}
  /SCALE('PsyTech_Reliability_Scale') ALL
  /MODEL=ALPHA
  /STATISTICS=DESCRIPTIVE SCALE CORR
  /SUMMARY=TOTAL.`,Be=()=>{navigator.clipboard.writeText(W()),re(!0),o("📋 تم نسخ كود SPSS Syntax المطور بنجاح!"),setTimeout(()=>re(!1),2e3)},Oe=()=>{const t=W(),s=new Blob([t],{type:"text/plain;charset=utf-8"}),a=URL.createObjectURL(s),l=document.createElement("a");l.href=a,l.download=E.endsWith(".sps")?E:`${E}.sps`,document.body.appendChild(l),l.click(),document.body.removeChild(l),o("📥 تم تحميل ملف الأوامر .sps للمقياس بنجاح!")},K=()=>{const t=p.globalAlpha.toFixed(3);let s="",a="";return p.globalAlpha>=.9?(s="اتساق ممتاز وثبات فائق (Excellent) وصالح لكافة الاستخدامات القياسية والعيادية التطبيقية",a="تؤكد تماسك المقياس داخلياً في استنباط السمات النفسية والقدرات المعرفية بدقة فائقة، مما يوصي باعتماد الأداة علمياً بموثوقية مطلقة."):p.globalAlpha>=.8?(s="ثبات مرتفع وجيد جداً (Good) متوافق مع معايير الأبحاث والنشر بالمجلات الرصينة",a="تعبر عن تماثل تام لاستجابات العينة، بما يضمن دلالات إحصائية رصينة وصادقة عند سحب الاستنتاجات الطبية والميدانية البعدية."):p.globalAlpha>=.7?(s="اتساق مقبول ومعقول منهجياً (Acceptable) ملائم للأبحاث الاستكشافية",a="يعد كافياً لجمع البيانات وسبر الآراء العامة، غير أنه يوصى بمراجعة البنود ذات الارتباط الأضعف بالمجموع الكلي للارتقاء أكثر بقوة الأداء السيكومتري."):(s="ثبات ضعيف وغير متسق (Poor/Unreliable) يتطلب تعديلاً كبيراً بفحوص الأخصائي",a="مما يحذر من هشاشة القياس الداخلي للأداة؛ ويتوجب منهجياً إما حذف الفراغات الشاردة والأسئلة غير المنسجمة، أو توسيع حجم العينة لتهذيب انحراف المقياس وملاءمته."),T==="clinical"?`[التقرير العيادي السيكولوجي لتجانس الاختبار - عيادة PsyTech]
نعلم الطبيب أو الممارس النفسي المكلف، بأنه فور إجراء عملية القياس اللحظي لمعادل الثبات للمقنن الميكروي الحالي وقوامه (k = ${r}) فقرات مدمجة، ومطبق على عينات منتقاة عيادياً قوامها (N = ${m}) مفحوصاً، ترشح معامل ألفا كرونباخ بقيمة حاسمة بلغت (α = ${t}).
تثبت الدلالة العيادية الحالية دقة تقييم تجانسي تصنيفه: "${s}". وعليه، ${a} يُنصح بنسخ مصفوفة القياس المعتمدة لمتابعة فترات الاستشفاء وتأمين ثبات الملاحظة السريرية للجرعات العلاجية بأريحية تامة.`:T==="critical"?`[ورقة نقد الأداة واستقراء الفروق السيكومترية - المختبر البحثي]
تخضع بنية أداة التشخيص الحالية المؤلفة من (k = ${r}) أسئلة إلى فحص الاتساق بمصفوفة استجابات قوامها (N = ${m}) مشاركاً. وقد تمخض الحل الحسابي عن معامل ثبات (α = ${t})، وهو ما يقترن إحصائياً بمرتبة جودة: "${s}".
التقدير الرياضي الحاسم: تشير النسبة الثباتة إلى أن تباين الخطأ في درجات المقياس يشكل فقط ${(Math.max(0,1-p.globalAlpha)*100).toFixed(1)}% من التباين الإجمالي، مما يجعل الموثوقية حيوية للغاية. وبناء على مناديد القياس؛ ${a} كما يتوقع تحسن الثبات بنمو النخبة ومراقبة البند المار به.`:`بناءً على نتائج التحليل السيكومتري للمقياس المطبق على عينة التجريب والتقنين الميداني البالغ قوامها (N = ${m}) مفحوصاً، ومكوناً من عدد بنود قوامها (k = ${r}) فقرة مستجيبة، أظهرت نتائج المعالجة الرياضية أن معامل ألفا كرونباخ العام للثبات والاتساق الداخلي (Cronbach's Alpha) قد بلغ (α = ${t}). 
ووفقاً للتوصيات المنهجية المتبعة بجمعية علم النفس الأمريكية (APA 7th Edition)، فإن قيمة الثبات المسجلة تشير بطابع تفصيلي إلى جودة سيكومترية مرتسمة بـ "${s}". وبالتالي، فإن ${a}`},Ge=()=>{navigator.clipboard.writeText(K()),le(!0),o("📋 تم نسخ الفقرة الأكاديمية بنجاح! جاهزة للصق في تقرير الرسالة الجامعية أو التبويب البحثي."),setTimeout(()=>le(!1),2e3)},pe=()=>{const t=p.globalAlpha.toFixed(3);V(p.globalAlpha).text;const s=K(),a=window.open("","_blank");if(!a){o("❌ خطأ بالمتصفح: يرجى السماح بالنوافذ المنبثقة للتمكن من تصدير ملف الـ PDF!");return}const l=p.itemAnalysis.map((n,h)=>`
      <tr style="border-bottom: 1px solid rgba(212, 175, 55, 0.15);">
        <td style="padding: 12px; font-weight: bold; color: #D4AF37;">البند ${h+1}</td>
        <td style="padding: 12px; font-family: 'JetBrains Mono', monospace; color: #fff;">${n.mean.toFixed(2)}</td>
        <td style="padding: 12px; font-family: 'JetBrains Mono', monospace; color: #fff;">${n.sd.toFixed(2)}</td>
        <td style="padding: 12px; font-family: 'JetBrains Mono', monospace; font-weight: bold; color: ${n.correlation<.2?"#F87171":"#34D399"};">${n.correlation.toFixed(3)}</td>
        <td style="padding: 12px; font-family: 'JetBrains Mono', monospace; color: #fff;">${n.alphaIfDeleted.toFixed(3)}</td>
        <td style="padding: 12px; font-size: 11px; color: rgba(255, 255, 255, 0.7);">${n.correlation>=.2?"مستحسن وبقاء مستحق":"يتطلب تهذيب أو مراجعة"}</td>
      </tr>
    `).join("");a.document.write(`
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
              <div>المعرف الفرعي: <span>${g||"PSY-MATRIX-GENERIC"}</span></div>
              <div>التاريخ: <span>${new Date().toLocaleDateString("ar-EG")}</span></div>
              <div>نبرة المعالجة: <span>${T==="clinical"?"عيادي":T==="critical"?"نقدي منهجى":"معايير الجمعية الأمريكية APA"}</span></div>
            </div>
          </div>

          <div class="main-title">
            التقرير السيكومتري لثبات المقياس والاتساق الداخلي
          </div>

          <div class="metric-badge-grid">
            <div class="metric-badge">
              <div class="val">${t}</div>
              <span class="lbl">معامل ألفا كرونباخ (α)</span>
            </div>
            <div class="metric-badge">
              <div class="val">${r}</div>
              <span class="lbl">عدد الأسئلة والعبارات (k)</span>
            </div>
            <div class="metric-badge">
              <div class="val">${m}</div>
              <span class="lbl">حجم العينة الرائدة (N)</span>
            </div>
            <div class="metric-badge">
              <div class="val">${p.totalVariance.toFixed(2)}</div>
              <span class="lbl">تباين الدرجات الكلية (s²)</span>
            </div>
          </div>

          <div class="commentary-box">
            <div class="commentary-header">
              <span>✦</span>
              التحليل والتفسير الأكاديمي المنهجي:
            </div>
            ${s}
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
                ${l}
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
        <\/script>
      </body>
      </html>
    `),a.document.close(),o("📄 تم تجهيز التقرير وجاري التهيئة للطباعة كـ PDF...")},Je=()=>{if(!Y.trim()){o("الرجاء إدخال بيانات صالحة أولاً!");return}try{const t=Y.trim().split(`
`).map(l=>l.split(/[\t, ]+/).map(n=>Number(n.trim())).filter(n=>!isNaN(n))).filter(l=>l.length>0);if(t.length===0)throw new Error("لم يتم العثور على أرقام صالحة.");const s=t[0].length,a=t.filter(l=>l.length===s);a.length<t.length&&o("تنبيه: تم استبعاد بعض الصفوف غير المتطابقة في عدد الأعمدة."),$(s),_(a.length),j(a),X(!1),U(""),o(`✅ تم بنجاح استيراد ${a.length} مبحوث × ${s} بند وتحديث الجدول الاحصائي للـ SPSS!`)}catch{o("❌ خطأ بالترجمة: تأكد من تباين الأرقام ووجود فاصلة أو مسافة جدولة بينها.")}},Ye=(()=>{const t=x.map(l=>l.reduce((n,h)=>n+h,0)),s=F(t),a=Math.sqrt(J(t))||1;return x.map((l,n)=>{const h=l.reduce((c,N)=>c+N,0),S=(h-s)/a,A=t.filter(c=>c<h).length,Q=t.filter(c=>c===h).length,b=(A+.5*Q)/t.length*100;return{subjectId:n+1,totalScore:h,zScore:Number(S.toFixed(3)),percentile:Number(b.toFixed(1)),category:b>=90?"جدًا مرتفع (متفوق)":b>=75?"مرتفع (فوق المتوسط)":b>=25?"طبيعي (متوسط)":b>=10?"منخفض (تحت المتوسط)":"متدني جداً (سريري بحري)"}})})(),me=p.globalAlpha,Z=M*me/(1+(M-1)*me);return e.jsxs("div",{className:"space-y-8 animate-in fade-in duration-500",dir:"rtl",children:[e.jsx(be,{children:y&&e.jsxs(ee.div,{initial:{opacity:0,y:-20,scale:.95},animate:{opacity:1,y:0,scale:1},exit:{opacity:0,y:-20,scale:.95},className:"fixed top-8 left-8 z-[200] bg-psy-gold text-psy-bg px-6 py-4 rounded-2xl text-[12px] font-black shadow-2xl flex items-center gap-3 border border-white/20 animate-bounce",children:[e.jsx(qe,{size:16,className:"text-psy-bg"}),e.jsx("span",{children:y})]})}),e.jsxs("div",{className:"flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gradient-to-l from-psy-gold/[0.04] to-transparent p-8 rounded-[36px] border border-psy-gold/15 relative overflow-hidden",children:[e.jsx("div",{className:"absolute left-0 bottom-0 top-0 w-48 bg-psy-gold/5 blur-3xl rounded-full"}),e.jsxs("div",{className:"space-y-2 relative z-10 text-right",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsxs("h1",{className:"text-2xl sm:text-3xl font-black text-white tracking-tight",children:["محطة التحليل السيكومتري ومساعد ",e.jsx("span",{className:"text-psy-gold",children:"SPSS"})," الذكي"]}),e.jsx("span",{className:"text-[10px] bg-psy-gold/20 text-psy-gold px-2.5 py-0.5 rounded-full font-black uppercase",children:"إصدار MVP 1.5"})]}),e.jsx("p",{className:"text-xs sm:text-sm text-psy-text/40 font-medium leading-relaxed max-w-2xl",children:"بيئة تفاعلية لخبراء علم النفس القياسي وأكاديميي علم السلوك للتلقيم الإحصائي، تكييف الاختبارات، صياغة تقرير الاتساق بنبرات دقيقة، والنسخ الفوري لملفات IBM SPSS Syntax الموجهة للمنهجية."})]}),e.jsxs("div",{className:"flex flex-wrap gap-2.5 relative z-10 font-bold",children:[e.jsxs("button",{onClick:()=>u("guide"),className:"px-5 h-12 rounded-xl bg-psy-gold/10 border border-[#D4AF37]/30 hover:bg-psy-gold hover:text-psy-bg text-psy-gold text-xs font-black transition-all flex items-center gap-2 active:scale-95 cursor-pointer shadow-lg",children:[e.jsx(te,{size:15}),e.jsx("span",{children:"طريقة الاستعمال 💡"})]}),e.jsxs("button",{onClick:()=>X(!0),className:"px-5 h-12 rounded-xl bg-white/5 border border-white/10 hover:border-psy-gold text-psy-text hover:text-psy-gold text-xs font-black transition-all flex items-center gap-2 active:scale-95 cursor-pointer header-excel-btn",children:[e.jsx(O,{size:15}),e.jsx("span",{children:"تلقيم مصفوفة Excel"})]})]})]}),e.jsx("div",{className:"flex flex-wrap gap-2 border-b border-white/5 pb-0",dir:"rtl",children:[{id:"matrix",label:"الخلية التفاعلية ومخرجات البنود",icon:O},{id:"commentary",label:"مفسر التعليق الأكاديمي الذكي",icon:ge},{id:"syntax",label:"صانع ومحرر أكواد SPSS syntax",icon:se},{id:"norms",label:"رادار التقنين وأسقف المعايير والدرجات",icon:fe},{id:"history",label:"أرشيف السجلات والربط السحابي",icon:G},{id:"grouped",label:"حاسبة الثبات السريعة (البيانات الإجمالية)",icon:ue},{id:"guide",label:"الدليل السيكومتري لثبات الاختبارات",icon:te}].map(t=>e.jsxs("button",{onClick:()=>u(t.id),className:`
              flex items-center gap-2 px-5 py-4 text-xs font-black transition-all relative cursor-pointer
              ${d===t.id?"text-psy-gold font-bold":"text-psy-text/40 hover:text-psy-text"}
            `,children:[e.jsx(t.icon,{size:14}),t.label,d===t.id&&e.jsx(ee.div,{layoutId:"labTabIndicator",className:"absolute bottom-0 left-0 right-0 h-[2px] bg-psy-gold rounded-t-full shadow-[0_0_8px_#d4af37]"})]},t.id))}),e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-3 gap-8",children:[e.jsxs("div",{className:"lg:col-span-2 space-y-6",children:[d==="matrix"&&e.jsxs("div",{className:"space-y-6 animate-in fade-in duration-300",children:[e.jsxs("div",{className:"flex flex-wrap gap-4 items-center justify-between p-5 bg-[#171716] border border-white/5 rounded-2xl",children:[e.jsxs("div",{className:"flex items-center gap-4 text-xs",children:[e.jsxs("div",{className:"space-y-1 text-right",children:[e.jsx("span",{className:"text-[10px] font-black text-psy-text/40 block",children:"عدد الأسئلة / البنود (k):"}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("button",{onClick:_e,className:"w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center font-bold text-lg text-psy-text transition-all cursor-pointer",children:"-"}),e.jsx("span",{className:"font-mono font-black text-psy-gold px-2 tabular-nums",children:r}),e.jsx("button",{onClick:$e,className:"w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center font-bold text-lg text-psy-text transition-all cursor-pointer",children:"+"})]})]}),e.jsx("div",{className:"h-8 w-[1px] bg-white/15"}),e.jsxs("div",{className:"space-y-1 text-right",children:[e.jsx("span",{className:"text-[10px] font-black text-psy-text/40 block",children:"حجم العينة / المبحوثين (N):"}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("button",{onClick:Le,className:"w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center font-bold text-lg text-psy-text transition-all cursor-pointer",children:"-"}),e.jsx("span",{className:"font-mono font-black text-psy-gold px-2 tabular-nums",children:m}),e.jsx("button",{onClick:Ee,className:"w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center font-bold text-lg text-psy-text transition-all cursor-pointer",children:"+"})]})]})]}),e.jsxs("div",{className:"flex flex-wrap gap-2",children:[e.jsxs("button",{onClick:Ve,className:"px-4 py-2 bg-psy-gold/15 border border-psy-gold/30 hover:border-psy-gold text-psy-gold text-[11px] font-black rounded-lg transition-all flex items-center gap-1.5 cursor-pointer",children:[e.jsx(ae,{size:12}),e.jsx("span",{children:"نسخ مصفوفة SPSS"})]}),e.jsxs("button",{onClick:Re,className:"px-4 py-2 bg-white/5 border border-white/10 hover:border-white/20 text-white text-[11px] font-black rounded-lg transition-all flex items-center gap-1.5 cursor-pointer",children:[e.jsx(se,{size:12}),e.jsx("span",{children:"أسماء البنود رتباً"})]})]})]}),e.jsxs(f,{className:"p-6 border-white/5 overflow-hidden",children:[e.jsx("div",{className:"flex justify-between items-center mb-4 text-right",children:e.jsxs("div",{children:[e.jsxs("h3",{className:"text-sm font-black text-white flex items-center gap-2",children:[e.jsx(O,{className:"text-psy-gold",size:16}),"المصفوفة الإحصائية التفاعلية النشطة (SPSS Live Matrix Grid)"]}),e.jsx("p",{className:"text-[10px] text-psy-text/40 font-semibold mt-1",children:"انقر بداخل أي خلية وحدث القيمة؛ سيتم على الفور إعادة حساب معامل الثبات واتساق البنود الفردية."})]})}),e.jsx("div",{className:"overflow-x-auto max-w-full rounded-2xl border border-white/5 custom-scrollbar",children:e.jsxs("table",{className:"w-full text-center text-xs border-collapse",children:[e.jsx("thead",{className:"bg-[#1b1b1a] select-none text-[10px] font-black text-psy-text/60",children:e.jsxs("tr",{children:[e.jsx("th",{className:"p-3 border-b border-left border-white/5 bg-black/40 text-psy-gold font-bold w-16",children:"المفحوص"}),Array(r).fill(0).map((t,s)=>e.jsxs("th",{className:"p-3 border-b border-white/5 min-w-[70px]",children:["بند ",s+1]},s)),e.jsx("th",{className:"p-3 border-b border-white/5 bg-psy-gold/5 text-psy-gold w-20 font-black",children:"المجموع"})]})}),e.jsx("tbody",{className:"divide-y divide-white/5 font-bold text-psy-text/80",children:x.map((t,s)=>{const a=t.reduce((l,n)=>l+n,0);return e.jsxs("tr",{className:"hover:bg-white/5 transition-colors",children:[e.jsxs("td",{className:"p-2 border-left border-white/5 bg-black/25 text-[10px] opacity-40 font-mono",children:["#",s+1]}),t.map((l,n)=>e.jsx("td",{className:"p-1",children:e.jsx("input",{type:"text",value:l,onChange:h=>Ie(s,n,h.target.value),className:"w-12 h-8 bg-[#111110] hover:bg-black/40 focus:bg-black border border-white/5 focus:border-psy-gold/50 rounded-lg text-center font-mono font-black text-white text-xs outline-none transition-all"})},n)),e.jsx("td",{className:"p-2 bg-psy-gold/[0.02] text-psy-gold font-mono font-black border-right border-white/5",children:a})]},s)})})]})})]}),e.jsxs(f,{className:"p-6 border-white/5",children:[e.jsx("div",{className:"flex justify-between items-center mb-4 text-right",children:e.jsxs("div",{children:[e.jsxs("h3",{className:"text-sm font-black text-white flex items-center gap-2",children:[e.jsx(He,{className:"text-psy-gold",size:16}),"تقرير الموثوقية وتأثير الحذف لكل بند (SPSS Item-Total Output)"]}),e.jsx("p",{className:"text-[10px] text-psy-text/40 font-semibold mt-0.5",children:"تأثير الاستغناء وحذف كل عبارة منفصلة على تماسك المقياس لمساعدتك على تصفية وحذف العبارات المشتتة."})]})}),e.jsx("div",{className:"overflow-hidden rounded-2xl border border-white/5",children:e.jsxs("table",{className:"w-full text-right text-xs",children:[e.jsx("thead",{className:"bg-[#1b1b1a] text-[10px] font-black text-psy-text/50",children:e.jsxs("tr",{children:[e.jsx("th",{className:"p-4",children:"رمز البند المنهجي"}),e.jsx("th",{className:"p-4 text-center",children:"المتوسط الحسابي (M)"}),e.jsx("th",{className:"p-4 text-center font-mono",children:"الانحراف المعياري (SD)"}),e.jsx("th",{className:"p-4 text-center",children:"ارتباط البند بالمجموع (Corrected r_it)"}),e.jsx("th",{className:"p-4 text-center",children:"معامل ألفا عند حذف البند (α if item deleted)"}),e.jsx("th",{className:"p-4 text-left",children:"التوصية السيكومترية"})]})}),e.jsx("tbody",{className:"divide-y divide-white/5 font-semibold text-psy-text/80",children:p.itemAnalysis.map((t,s)=>e.jsxs("tr",{className:"hover:bg-white/5 transition-colors",children:[e.jsxs("td",{className:"p-4 font-black text-psy-gold text-xs",children:["البند ",s+1]}),e.jsx("td",{className:"p-4 text-center font-mono",children:t.mean.toFixed(2)}),e.jsx("td",{className:"p-4 text-center font-mono",children:t.sd.toFixed(2)}),e.jsx("td",{className:`p-4 text-center font-mono font-black ${t.correlation<.2?"text-red-400 font-bold":"text-emerald-400"}`,children:t.correlation.toFixed(3)}),e.jsx("td",{className:"p-4 text-center font-mono text-white",children:t.alphaIfDeleted.toFixed(3)}),e.jsx("td",{className:"p-4 text-left",children:t.correlation>=.2?e.jsx("span",{className:"text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-black",children:"بقاء مستحق"}):t.correlation>=0?e.jsx("span",{className:"text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-black",children:"مراجعة وصياغة"}):e.jsx("span",{className:"text-[9px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded font-black",children:"تصفية / حذف فوري ⚠️"})})]},t.id))})]})})]})]}),d==="commentary"&&e.jsx("div",{className:"space-y-6 animate-in fade-in duration-300",children:e.jsxs(f,{className:"p-8 space-y-6 relative overflow-hidden border border-psy-gold/20 shadow-lg shadow-psy-gold/5",children:[e.jsx("div",{className:"absolute top-0 left-0 w-32 h-32 bg-psy-gold/5 rounded-full blur-2xl -ml-10 -mt-10"}),e.jsx("div",{className:"flex justify-between items-start text-right border-b border-white/5 pb-4",children:e.jsxs("div",{className:"space-y-1",children:[e.jsxs("h3",{className:"text-md font-black text-psy-gold flex items-center gap-2",children:[e.jsx(ge,{className:"animate-pulse",size:18}),"رابط التوليد والتعليق الأكاديمي السيكومتري (Smart Academic Commentary)"]}),e.jsx("p",{className:"text-xs text-psy-text/40 font-bold leading-relaxed max-w-xl",children:"يقوم النظام بصياغة فقرة تفسيرية معيارية بأسلوب البحث العلمي الرصين، مع حقن المعطيات الحالية للأداة تلقائياً لمزيد من الاحترافية الأكاديمية."})]})}),e.jsxs("div",{className:"flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4.5 bg-[#171716] border border-white/5 rounded-2xl",children:[e.jsxs("div",{className:"flex flex-wrap gap-3",children:[e.jsxs("span",{className:"px-3.5 py-1.5 bg-psy-gold/10 text-psy-gold border border-psy-gold/15 rounded-xl text-xs font-mono font-semibold",children:["العينة N = ",m]}),e.jsxs("span",{className:"px-3.5 py-1.5 bg-white/5 text-white border border-white/10 rounded-xl text-xs font-mono font-semibold",children:["البنود k = ",r]}),e.jsxs("span",{className:"px-3.5 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 rounded-xl text-xs font-mono font-semibold",children:["الاتساق α = ",p.globalAlpha.toFixed(4)]})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx("span",{className:"text-[10px] text-psy-text/40 font-black block text-right",children:"نبرة التفسير والصياغة المنهجية:"}),e.jsx("div",{className:"grid grid-cols-3 gap-1.5 bg-black/40 p-1 border border-white/5 rounded-xl",children:[{id:"standards",name:"أكاديمي APA"},{id:"clinical",name:"عيادي مباشر"},{id:"critical",name:"نقد وتحليل"}].map(t=>e.jsx("button",{onClick:()=>Ne(t.id),className:`px-3 py-1 text-[10.5px] font-bold rounded-lg transition-all cursor-pointer ${T===t.id?"bg-psy-gold text-psy-bg font-bold shadow-md shadow-psy-gold/10":"text-psy-text/50 hover:text-white hover:bg-white/5"}`,children:t.name},t.id))})]})]}),e.jsxs("div",{className:"bg-black/40 p-6 rounded-3xl border border-psy-gold/10 hover:border-psy-gold/30 transition-all relative",children:[e.jsx("span",{className:"text-[10px] bg-psy-gold/20 text-psy-gold px-2.5 py-1 rounded-lg font-black tracking-widest absolute top-4 left-4 font-sans select-none",children:"FORMATTED ANALYSIS"}),e.jsx("div",{className:"text-right text-xs leading-relaxed text-slate-200 select-text font-medium text-justify font-sans space-y-4 whitespace-pre-wrap max-h-[350px] overflow-y-auto",children:K()})]}),e.jsxs("div",{className:"flex justify-between items-center bg-[#171716] p-4 rounded-2xl border border-white/5 gap-3 flex-wrap",children:[e.jsx("span",{className:"text-[10.5px] text-psy-text/30 font-medium col-span-1",children:"متوافق تماماً مع التفسير الرياضي لمصفوفات الارتباط والاتساق الداخلي."}),e.jsxs("div",{className:"flex gap-2",children:[e.jsxs("button",{onClick:pe,className:"px-6 py-3 bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-[#D4AF37] border border-[#D4AF37]/35 rounded-xl font-black text-xs transition-all flex items-center gap-2 cursor-pointer shadow-lg",children:[e.jsx(ye,{size:14}),e.jsx("span",{children:"تصدير التقرير كـ PDF 📄"})]}),e.jsx("button",{onClick:Ge,className:"px-6 py-3 bg-psy-gold hover:opacity-95 text-psy-bg rounded-xl font-black text-xs transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-psy-gold/15",children:ve?e.jsxs(e.Fragment,{children:[e.jsx(We,{size:14,className:"stroke-[3]"}),e.jsx("span",{children:"تم نسخ التفسير الأكاديمي!"})]}):e.jsxs(e.Fragment,{children:[e.jsx(ae,{size:14}),e.jsx("span",{children:"نسخ التقرير إلى الحافظة"})]})})]})]})]})}),d==="syntax"&&e.jsx("div",{className:"space-y-6 animate-in fade-in duration-300",children:e.jsxs(f,{className:"p-8 space-y-6 relative overflow-hidden",children:[e.jsx("div",{className:"absolute top-0 right-0 w-32 h-32 bg-psy-gold/5 rounded-full blur-2xl -mr-10 -mt-10"}),e.jsx("div",{className:"flex justify-between items-center text-right border-b border-white/5 pb-4",children:e.jsxs("div",{className:"space-y-1",children:[e.jsxs("h3",{className:"text-sm font-black text-white flex items-center gap-2",children:[e.jsx(se,{size:16,className:"text-psy-gold animate-bounce"}),"مولد جمل وأكواد SPSS Syntax الديناميكية الموجهة"]}),e.jsx("p",{className:"text-[10px] text-psy-text/40 font-semibold mt-1",children:"ينتج هذا الكود البرمجي مخرجات الثبات لمقياسك مع استدعاء إحصاءات التفاصيل والوصف والارتباط."})]})}),e.jsxs("div",{className:"grid md:grid-cols-2 gap-4 bg-[#171716] p-4.5 rounded-2xl border border-white/5",children:[e.jsxs("div",{className:"space-y-1 text-right",children:[e.jsx("label",{className:"text-[11px] font-black text-psy-text/40",children:"تسمية وتخصيص ملف الأوامر المصدّر:"}),e.jsx("input",{type:"text",value:E,onChange:t=>we(t.target.value),className:"w-full bg-black/40 text-psy-gold border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono focus:border-psy-gold outline-none"})]}),e.jsxs("div",{className:"flex items-end justify-end gap-2",children:[e.jsxs("button",{onClick:Be,className:"px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white text-xs font-black rounded-lg transition-all flex items-center gap-1.5 cursor-pointer border border-white/10",children:[e.jsx(ae,{size:12}),ke?"نسخ!":"نسخ الكود"]}),e.jsxs("button",{onClick:Oe,className:"px-4 py-2.5 bg-psy-gold text-psy-bg text-xs font-black rounded-lg transition-all flex items-center gap-1.5 hover:opacity-90 active:scale-95 cursor-pointer",children:[e.jsx(Ke,{size:12}),e.jsx("span",{children:"تنزيل ملف .sps"})]})]})]}),e.jsxs("div",{className:"bg-black/60 p-5 rounded-3xl border border-white/5 relative overflow-hidden font-mono text-xs text-left",dir:"ltr",children:[e.jsx("span",{className:"text-[9px] bg-white/5 border border-white/10 text-white/40 px-2 py-0.5 rounded absolute top-3 right-3 font-sans select-none pointer-events-none",children:"IBM SPSS COMPLIANT"}),e.jsx("pre",{className:"whitespace-pre-wrap select-text text-emerald-400 max-h-[250px] overflow-y-auto leading-relaxed pt-2",children:W()})]}),e.jsxs("div",{className:"p-4 bg-psy-gold/[0.02] border border-psy-gold/10 rounded-2xl text-right space-y-1.5 leading-relaxed",children:[e.jsx("span",{className:"text-[9px] font-black text-psy-gold uppercase tracking-wider block",children:"سياق محرر ملف مخرجات SPSS:"}),e.jsxs("ul",{className:"text-[10.5px] text-psy-text/50 space-y-1 list-inside list-disc",children:[e.jsxs("li",{children:["في محرر IBM SPSS الرئيسي، اذهب للخيار: ",e.jsxs("strong",{children:["File ","->"," New ","->"," Syntax"]}),"."]}),e.jsx("li",{children:"الصق الكود البرمجي وأشر على كافة الأسطر بمؤشر الماوس."}),e.jsx("li",{children:"اضغط على زر تشغيل السهم الأخضر لإنتاج مصفوفة الثبات والارتباطات تلقائيًا وبسرعة."})]})]})]})}),d==="norms"&&e.jsxs("div",{className:"space-y-6 animate-in fade-in duration-300",children:[e.jsxs(f,{className:"p-8 space-y-6 border border-psy-gold/15 relative overflow-hidden",children:[e.jsx("div",{className:"absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-psy-gold/10 to-transparent blur-xl"}),e.jsxs("div",{className:"space-y-1 text-right border-b border-white/5 pb-4",children:[e.jsxs("h3",{className:"text-md font-black text-psy-gold flex items-center gap-2",children:[e.jsx(Ze,{size:18}),"أداة التنبؤ الذاتي لثبات الأشكال الطولية المقتطعة (Spearman-Brown Estimator)"]}),e.jsx("p",{className:"text-xs text-psy-text/40 font-bold leading-relaxed max-w-xl",children:"بناء وتصميم الاختبارات يتطلب أحياناً حذف أو مضاعفة عدد العبارات (المضاعفة السيكومترية). يتيح هذا المحاكي تقدير مستوى الثبات الجديد والمقود بطبيعة طول المقياس المقنن."})]}),e.jsxs("div",{className:"grid md:grid-cols-3 gap-6 items-center",children:[e.jsxs("div",{className:"md:col-span-2 space-y-4",children:[e.jsxs("div",{className:"flex justify-between items-center text-xs font-bold text-psy-text",children:[e.jsx("span",{children:"حجم تعديل طول الأداة (عدد المرات م):"}),e.jsxs("span",{className:"text-psy-gold font-mono text-[14px]",children:[M," أضعاف (k = ",Math.round(r*M)," بند)"]})]}),e.jsxs("div",{className:"relative",children:[e.jsx("input",{type:"range",min:"0.25",max:"5.0",step:"0.25",value:M,onChange:t=>Se(Number(t.target.value)),className:"w-full accent-psy-gold bg-black/50 h-2 rounded-lg cursor-pointer transition-all"}),e.jsxs("div",{className:"flex justify-between text-[9px] font-mono text-psy-text/30 mt-1",children:[e.jsx("span",{children:"الربع (0.25)"}),e.jsx("span",{children:"النصف (0.5)"}),e.jsx("span",{children:"مستوى طبيعي (1.0)"}),e.jsx("span",{children:"مضاعف (2.0)"}),e.jsx("span",{children:"خمس مرات (5.0)"})]})]})]}),e.jsxs("div",{className:"bg-gradient-to-b from-[#111110] to-[#121211] p-5 rounded-2xl border border-psy-gold/10 text-center flex flex-col justify-center",children:[e.jsx("span",{className:"text-[9px] font-black text-psy-text/40 block",children:"الـ Alpha المتوقعة (Predicted α)"}),e.jsx("div",{className:"text-4xl font-mono font-black text-psy-gold tracking-tight mt-1",children:Z.toFixed(3)}),e.jsx("div",{className:"mt-2 inline-block",children:Z>=.8?e.jsx("span",{className:"text-[9px] bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/10 font-bold",children:"اتساق متوقع ممتاز"}):Z>=.7?e.jsx("span",{className:"text-[9px] bg-amber-500/15 text-amber-400 px-2 py-0.5 rounded border border-amber-500/10 font-bold",children:"اتساق مقدر مقبول"}):e.jsx("span",{className:"text-[9px] bg-red-500/15 text-red-500 px-2 py-0.5 rounded border border-red-500/10 font-bold",children:"تراجع غير موقود بالثبات"})})]})]})]}),e.jsxs(f,{className:"p-6 border-white/5 overflow-hidden",children:[e.jsx("div",{className:"flex justify-between items-center mb-4 text-right",children:e.jsxs("div",{children:[e.jsxs("h3",{className:"text-sm font-black text-white flex items-center gap-2",children:[e.jsx(fe,{className:"text-psy-gold",size:16}),"توطين المعايير والدرجات المعيارية والرتب المئينية (Norms Standardized Tableau)"]}),e.jsx("p",{className:"text-[10px] text-psy-text/40 font-semibold mt-1",children:"تم ترحيل وتحويل درجات الكشوف الحالية لعينة التجريب لدركات رتب ونسب معيارية لتسهيل إسقاط معاقل الاختبار."})]})}),e.jsx("div",{className:"overflow-x-auto rounded-xl border border-white/5",children:e.jsxs("table",{className:"w-full text-center text-xs",children:[e.jsx("thead",{className:"bg-[#1b1b1a] text-[10px] font-black text-psy-text/50",children:e.jsxs("tr",{children:[e.jsx("th",{className:"p-4 text-right",children:"رقم المفحوص"}),e.jsx("th",{className:"p-4",children:"الدرجة الكلية (X)"}),e.jsx("th",{className:"p-4",children:"الدرجة المعيارية Z-Score"}),e.jsx("th",{className:"p-4",children:"الرتبة المئينية (Percentile)"}),e.jsx("th",{className:"p-4 text-left",children:"التصنيف المعياري المقنن"})]})}),e.jsx("tbody",{className:"divide-y divide-white/5 font-semibold text-psy-text/80",children:Ye.map(t=>e.jsxs("tr",{className:"hover:bg-white/5 transition-colors",children:[e.jsxs("td",{className:"p-4 text-right",children:["المفحوص #",t.subjectId]}),e.jsx("td",{className:"p-4 font-mono font-bold text-white",children:t.totalScore}),e.jsx("td",{className:`p-4 font-mono font-black ${t.zScore>=0?"text-emerald-400":"text-amber-400"}`,children:t.zScore>=0?`+${t.zScore}`:t.zScore}),e.jsxs("td",{className:"p-4 font-mono text-psy-gold",children:[t.percentile,"%"]}),e.jsx("td",{className:"p-4 text-left font-sans",children:e.jsx("span",{className:"text-[10px] opacity-75",children:t.category})})]},t.subjectId))})]})})]})]}),d==="history"&&e.jsx("div",{className:"space-y-6 animate-in fade-in duration-300",children:e.jsxs(f,{className:"p-8 space-y-6",children:[e.jsxs("div",{className:"flex justify-between items-center text-right border-b border-white/5 pb-4",children:[e.jsxs("div",{className:"space-y-1",children:[e.jsxs("h3",{className:"text-md font-black text-white flex items-center gap-2",children:[e.jsx(G,{className:"text-psy-gold animate-pulse",size:17}),"أرشيف السجلات وحفظ مصفوفات القياس (Clinical Session Cloud Logs)"]}),e.jsx("p",{className:"text-xs text-psy-text/40 font-bold leading-relaxed",children:"هيكل تخزين لحفظ تحليلاتك واستدعائها بأعمدة ومقاييس ليكرت لحفظ تقدمك الميداني بشكل تاريخي منظم ومحمي ضد الضياع."})]}),e.jsxs("button",{onClick:de,className:"px-5 py-3 h-11 rounded-xl bg-psy-gold text-psy-bg text-xs font-black hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-psy-gold/15",children:[e.jsx(Qe,{size:14,className:"stroke-[3]"}),e.jsx("span",{children:"حفظ المقياس الحالي"})]})]}),e.jsxs("div",{className:"p-5 bg-[#171716] border border-white/5 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between",children:[e.jsxs("div",{className:"w-full md:w-2/3 space-y-1 text-right",children:[e.jsx("label",{className:"text-[10px] font-black text-psy-text/40 block",children:"اسم المقياس أو رمز الجلسة لحفظها بالأرشيف:"}),e.jsx("input",{type:"text",placeholder:"مثال: مقياس القلق الاجتماعي المقنن للجامعة 2026",value:w,onChange:t=>k(t.target.value),className:"w-full bg-black/40 text-psy-gold border border-white/10 rounded-xl px-4 py-3 text-xs focus:border-psy-gold outline-none"})]}),e.jsxs("div",{className:"text-right",children:[e.jsx("span",{className:"text-[9px] text-psy-text/30 block mb-1",children:"کود الجلسة النشط:"}),e.jsx("span",{className:"font-mono text-[10px] text-white/50 bg-black/40 p-2 border border-white/5 rounded-lg select-all",children:g})]})]}),e.jsxs("div",{className:"space-y-3",children:[e.jsx("h4",{className:"text-xs font-black text-psy-text mr-1",children:"السجلات والأرشيفات الإحصائية الجاهزة:"}),Ce?e.jsxs("div",{className:"text-center py-12 text-psy-text/40 text-xs font-bold flex items-center justify-center gap-2",children:[e.jsx("div",{className:"w-4 h-4 rounded-full border-2 border-psy-gold border-t-transparent animate-spin"}),e.jsx("span",{children:"جاري تعبئة الأرشيف من مخبر البيانات السحابي..."})]}):oe.length===0?e.jsxs("div",{className:"text-center py-12 border border-dashed border-white/10 rounded-2xl text-psy-text/40 text-xs font-bold leading-relaxed space-y-2",children:[e.jsx(G,{size:28,className:"mx-auto text-white/10"}),e.jsx("p",{children:"لا توجد سجلات مؤرشفة بقاعدة البيانات حالياً."}),e.jsx("p",{className:"text-[10px] opacity-60",children:'قم بالضغط على زر "حفظ المقياس الحالي" لتأمين مصفوفتك الراهنة في السجلات.'})]}):e.jsx("div",{className:"grid gap-3.5 max-h-[380px] overflow-y-auto custom-scrollbar pr-1",children:oe.map(t=>e.jsxs("div",{onClick:()=>ze(t),className:`p-4.5 rounded-2xl border transition-all cursor-pointer text-right flex items-center justify-between ${g===t.matrixId?"bg-psy-gold/5 border-psy-gold text-white":"bg-white/5 hover:bg-white/[0.08] border-white/10 text-psy-text/80"}`,children:[e.jsxs("div",{className:"space-y-1.5",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"font-extrabold text-xs text-white",children:t.name}),g===t.matrixId&&e.jsx("span",{className:"bg-psy-gold text-psy-bg text-[8px] font-black px-1.5 py-0.5 rounded uppercase",children:"نشط حالياً"})]}),e.jsxs("div",{className:"flex gap-4 text-[10.5px] text-psy-text/40 font-semibold font-mono",children:[e.jsxs("span",{children:["k = ",t.parameters.k," بنود"]}),e.jsxs("span",{children:["N = ",t.parameters.N," مبحوثين"]}),e.jsxs("span",{className:"text-psy-gold",children:["α = ",t.calculatedMetrics.cronbachAlpha.toFixed(3)]}),e.jsx("span",{className:"opacity-60",children:new Date(t.timestamp).toLocaleString("ar-EG")})]})]}),e.jsx("button",{onClick:s=>Pe(t.matrixId,s),className:"p-2 text-psy-text/40 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer",title:"حذف الأرشفة",children:e.jsx(et,{size:14})})]},t.matrixId))})]})]})}),d==="grouped"&&e.jsx("div",{className:"space-y-6 animate-in fade-in duration-300",children:e.jsxs(f,{className:"p-8 space-y-6",children:[e.jsxs("div",{className:"space-y-2 text-right",children:[e.jsxs("h3",{className:"text-md font-black text-psy-gold flex items-center gap-2",children:[e.jsx(ue,{size:18}),"حاسبة معوقات ألفا للقيم الكلية الجاهزة (Cronbach's Alpha Calculator)"]}),e.jsx("p",{className:"text-xs text-psy-text/40 leading-relaxed font-bold",children:"حين ترغب باختبار معامل ألفا بناء على قيم ومؤشرات إحصائية معلنة من ملخص دراسات سابقة، يمكنك كتابة المتغيرات الإجمالية هنا دون تلقيم خلايا الاستجابة."})]}),e.jsxs("div",{className:"grid md:grid-cols-2 gap-8 p-6 bg-[#161615] border border-white/5 rounded-3xl",children:[e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-1.5 text-right",children:[e.jsx("label",{className:"text-[11px] font-black text-psy-text/50 mr-1",children:"عدد البنود أو فقرات المقياس (k):"}),e.jsx("input",{type:"number",value:L,onChange:t=>De(Math.max(2,Number(t.target.value))),className:"w-full bg-[#111110] border border-white/10 rounded-xl px-4 py-3 text-sm font-black text-psy-gold focus:border-psy-gold outline-none transition-all font-mono"})]}),e.jsxs("div",{className:"space-y-1.5 text-right",children:[e.jsx("label",{className:"text-[11px] font-black text-psy-text/50 mr-1",children:"مجموع تباينات البنود المنفردة (Σ s_i²):"}),e.jsx("input",{type:"number",step:"0.01",value:ie,onChange:t=>Te(Math.max(.1,Number(t.target.value))),className:"w-full bg-[#111110] border border-white/10 rounded-xl px-4 py-3 text-sm font-black text-white focus:border-psy-gold outline-none transition-all font-mono"})]}),e.jsxs("div",{className:"space-y-1.5 text-right",children:[e.jsx("label",{className:"text-[11px] font-black text-psy-text/50 mr-1",children:"التباين الكلي للدرجة الإجمالية للمقياس (s_T²):"}),e.jsx("input",{type:"number",step:"0.1",value:q,onChange:t=>Me(Math.max(.1,Number(t.target.value))),className:"w-full bg-[#111110] border border-white/10 rounded-xl px-4 py-3 text-sm font-black text-white focus:border-psy-gold outline-none transition-all font-mono"})]})]}),e.jsxs("div",{className:"bg-black/40 border border-psy-gold/10 rounded-2xl p-6 flex flex-col justify-between text-right",children:[e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex justify-between items-center border-b border-white/5 pb-2",children:[e.jsx("span",{className:"text-[10px] font-black text-psy-gold uppercase tracking-wider",children:"النتائج السيكومترية"}),e.jsx("span",{className:"text-[9px] text-psy-text/30 font-mono",children:"معادلة ألفا القياسية"})]}),e.jsxs("div",{className:"text-center py-6",children:[e.jsx("span",{className:"text-[10px] font-bold text-psy-text/40 uppercase block mb-1",children:"المعامل المحسوب (α)"}),e.jsx("div",{className:"text-6xl font-black font-mono text-psy-gold tabular-nums select-all filter drop-shadow-[0_0_10px_rgba(212,175,55,0.15)]",children:P.toFixed(3)})]}),e.jsxs("div",{className:"space-y-2 text-xs",children:[e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"text-psy-text/40",children:"نسبة التباين الموثوق:"}),e.jsxs("span",{className:"font-mono text-white",children:[(P*100).toFixed(1),"%"]})]}),e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"text-psy-text/40",children:"نسبة تباين الخطأ المعياري:"}),e.jsxs("span",{className:"font-mono text-white",children:[(Math.max(0,1-P)*100).toFixed(1),"%"]})]})]})]}),e.jsxs("div",{className:`mt-4 p-4 rounded-xl text-xs font-black text-center leading-relaxed ${V(P).color}`,children:["التقييم الأكاديمي:",e.jsx("div",{className:"mt-1 font-bold normal-case text-[11px] leading-relaxed text-justify opacity-90",children:V(P).text})]})]})]})]})}),d==="guide"&&e.jsxs("div",{className:"space-y-6 animate-in fade-in duration-300",children:[e.jsxs(f,{className:"p-8 space-y-6 text-right",children:[e.jsxs("div",{className:"border-b border-white/5 pb-4",children:[e.jsx("span",{className:"text-[10px] font-black text-psy-gold uppercase tracking-[0.25em] block",children:"OPERATIONAL HOW-TO GUIDE"}),e.jsxs("h3",{className:"text-lg font-black text-white flex items-center gap-1.5 mt-1",children:[e.jsx(te,{size:18,className:"text-psy-gold"}),"دليل خطوات الاستعمال التشغيلية لحساب الثبات وتصديره"]}),e.jsx("p",{className:"text-xs text-psy-text/40 mt-1 font-semibold",children:"إليك الخطوات التفصيلية لإدخال البيانات وتحليلها واستخراج التقرير في بضع ثوانٍ:"})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6 text-[12px] leading-relaxed",children:[e.jsxs("div",{className:"bg-black/30 p-5 rounded-2xl border border-white/5 space-y-3",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("div",{className:"w-6 h-6 rounded-full bg-psy-gold/20 flex items-center justify-center text-psy-gold font-black text-xs",children:"١"}),e.jsx("h4",{className:"font-extrabold text-[#D4AF37]",children:"تلقيم واستيراد البيانات (Excel / SPSS):"})]}),e.jsxs("p",{className:"text-psy-text/60 leading-relaxed font-light text-justify",children:["اضغط على زر ",e.jsx("strong",{className:"text-white",children:'"تلقيم مصفوفة Excel"'})," في الأعلى، ثم الصق قيم الأجوبة المفصولة بعلامة جدولة أو فاصلة (مثال: نسخ جدول الدرجات مباشرة من أوراق Excel أو جداول جوجل). سيقوم المحلل باستيرادها وصياغة شبكة المعطيات تلقائياً بلمح البصر."]})]}),e.jsxs("div",{className:"bg-black/30 p-5 rounded-2xl border border-white/5 space-y-3",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("div",{className:"w-6 h-6 rounded-full bg-psy-gold/20 flex items-center justify-center text-psy-gold font-black text-xs",children:"٢"}),e.jsx("h4",{className:"font-extrabold text-[#D4AF37]",children:"تعديل الدرجات حياً ومعالجة الاستجابات:"})]}),e.jsxs("p",{className:"text-psy-text/60 leading-relaxed font-light text-justify",children:["انتقِل لتبويبة ",e.jsx("strong",{className:"text-white",children:'"مصفوفة إدخال الدرجات"'})," لمراجعة البيانات. يمكنك النقر المزدوج على أي خلية لتغيير درجة مفحوص معين، أو إضافة سطور (مفحوصين جدد) ومسح أعمدة (بنود) لتحديث تقديرات ألفا كرونباخ والتباين تلقائياً وبشكل حي وفوري."]})]}),e.jsxs("div",{className:"bg-black/30 p-5 rounded-2xl border border-white/5 space-y-3",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("div",{className:"w-6 h-6 rounded-full bg-psy-gold/20 flex items-center justify-center text-psy-gold font-black text-xs",children:"٣"}),e.jsx("h4",{className:"font-extrabold text-[#D4AF37]",children:"قراءة معامل الثبات والفقرات الضعيفة:"})]}),e.jsx("p",{className:"text-psy-text/60 leading-relaxed font-light text-justify",children:"راجع مؤشر ألفا التراكمي في الجانب الأيسر. توجه بانتظام لجدول البنود المفتتة، فإذا لاحظت بنداً ذو ارتباط ضعيف بالدرجة الكلية (أقل من 0.20)، يعطيك المعالج تنبيهاً باللون الأحمر، مما يشير إلى أن حذفه عبر زر الحذف المدمج يساهم فوراً في رفع النسبة الكلية للاتساق."})]}),e.jsxs("div",{className:"bg-black/30 p-5 rounded-2xl border border-white/5 space-y-3",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("div",{className:"w-6 h-6 rounded-full bg-psy-gold/20 flex items-center justify-center text-psy-gold font-black text-xs",children:"٤"}),e.jsx("h4",{className:"font-extrabold text-[#D4AF37]",children:"توليد التعليق وتصدير PDF الفاخر:"})]}),e.jsxs("p",{className:"text-psy-text/60 leading-relaxed font-light text-justify",children:["توجه لتبويبة ",e.jsx("strong",{className:"text-white",children:'"مفسر التعليق الأكاديمي الذكي"'})," واختر نبرة الصياغة الإحصائية المفضلة لديك (معايير APA، عيادي صِرْف، أو نقدي منهجي). بعدها اضغط على زر ",e.jsx("strong",{className:"text-white",children:'"تصدير التقرير كـ PDF"'})," للحصول على مستند ممهور ومختوم وجاهز فوري للطباعة والبحث الأكاديمي."]})]})]})]}),e.jsxs(f,{className:"p-8 space-y-6 text-right",children:[e.jsxs("div",{className:"border-b border-white/5 pb-4",children:[e.jsx("span",{className:"text-[10px] font-black text-[#D4AF37]/70 uppercase tracking-[0.25em] block",children:"SCIENTIFIC PRINCIPLES"}),e.jsxs("h3",{className:"text-lg font-black text-white flex items-center gap-1.5 mt-1",children:[e.jsx(tt,{size:18,className:"text-[#D4AF37]"}),"التوجيهات المنهجية لتأسيس الصدق والثبات عيادياً"]}),e.jsx("p",{className:"text-xs text-psy-text/40 mt-1 font-bold",children:"بموافقة دليل جمعية علم النفس الأمريكية (APA 7th Edition) لتقنين أدوات التشخيص السلوكي."})]}),e.jsxs("div",{className:"space-y-6 text-[12px] leading-relaxed text-justify text-psy-text/80",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("h4",{className:"font-extrabold text-[#D4AF37] flex items-center gap-1.5",children:"١. معامل ألفا كرونباخ والاتساق الداخلي (Internal Consistency):"}),e.jsx("p",{className:"text-psy-text/60 leading-relaxed",children:"يعتمد الاتساق الداخلي (الألفا) على فرضية تقاطع جميع فقرات أداة القياس على بعد أحادي، وتعني القيمة المرتفعة تماسك العبارات في الكشف عن نفس المتغير النفسي المراد اختبار المريض به. إذا احتوت أداتك على أبعاد منفصلة كلياً (مثلاً: القلق والنبض الجسدي)، فإن المنهجية العلمية تلزم حساب معامل ألفا *لكل بعد على حدة* بدلاً من المجموع الكلي لتجنب تشويه مؤشر الصدق الفني."})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("h4",{className:"font-extrabold text-[#D4AF37] flex items-center gap-1.5",children:"٢. ارتباط البند الإجمالي المصحح (Corrected Item-Total Correlation):"}),e.jsxs("p",{className:"text-psy-text/60 leading-relaxed",children:["يعبر هذا المعامل عن ارتباط طردي بين فقرة مستقلة وبين الدرجة الإجمالية للمقياس الصافية من أثر ذلك البند. إذا كانت قيمة الارتباط لفقرة معينة أقل من ",e.jsx("strong",{className:"text-white font-mono font-bold",children:"0.20"}),"، فهذه مؤشر معترف به إحصائياً بأن البند يسير في اتجاه معارض لنمط الأسئلة الأخرى، ويتوجب حذفها أو تعديلها لأنها تخفض ثبات المقياس الإجمالي."]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("h4",{className:"font-extrabold text-[#D4AF37] flex items-center gap-1.5",children:"٣. حجم العينة المقنن وطرق جمع العينات الحقيقية:"}),e.jsxs("p",{className:"text-psy-text/60 leading-relaxed",children:["للتمثيل الإحصائي العادل وتقنين الاختبارات المحلية بالوطن العربي والجزائر، يوصى بأن لا تتدنى العينة الاستطلاعية للصدق والثبات العاملي الاستكشافي عن ",e.jsx("strong",{className:"text-white font-mono font-bold",children:"5"})," إلى ",e.jsx("strong",{className:"text-white font-mono font-bold",children:"10"})," مفحوصين لكل بند من المقياس (مثلا: مقياس يحتوي 20 بنداً يتطلب عينة لا تقل عن 100 إلى 200 طبيب أو مفحوص سريري لضمان دقة دلالة p-value العالية)."]})]})]}),e.jsxs("div",{className:"pt-4 border-t border-white/5 text-[11px] text-psy-text/40 leading-normal flex items-center gap-2",children:[e.jsx(je,{size:14,className:"text-psy-gold"}),e.jsx("span",{children:"محرر سيكومتري موثق ومعياري متوافق بنسبة 100% مع حسابات SPSS و SAS ومحرك R الإحصائي."})]})]})]})]}),e.jsxs("div",{className:"space-y-6",children:[e.jsxs(f,{className:"p-8 space-y-6 border-white/5 text-right relative overflow-hidden",children:[e.jsx("div",{className:"absolute top-0 left-0 w-24 h-24 bg-psy-gold/5 rounded-full blur-xl -ml-6 -mt-6"}),e.jsxs("h4",{className:"font-black text-xs uppercase tracking-widest text-[#D4AF37] flex items-center gap-1.5 border-b border-white/5 pb-3 relative z-10",children:[e.jsx(st,{size:14}),"خلاصة الموثوقية للمصفوفة"]}),e.jsxs("div",{className:"space-y-5 relative z-10 animate-in fade-in",children:[e.jsxs("div",{className:"text-center py-4 bg-white/[0.02] border border-white/5 rounded-2xl",children:[e.jsx("span",{className:"text-[10px] text-psy-text/40 font-bold block mb-1",children:"معامل الثبات الكلي للجدول (α)"}),e.jsx("div",{className:"text-5xl font-mono font-black text-psy-gold select-all tabular-nums filter drop-shadow-[0_0_10px_rgba(212,175,55,0.15)]",children:p.globalAlpha.toFixed(3)}),e.jsxs("span",{className:"text-[8px] bg-white/5 border border-white/10 text-white/50 px-2 py-0.5 rounded font-mono mt-2 inline-block",children:["k = ",r," | N = ",m]})]}),e.jsxs("div",{className:`p-4 rounded-xl text-[10.5px] leading-relaxed font-bold border ${xe.color}`,children:[e.jsx("span",{className:"font-black text-white block mb-1",children:"التقييم المنهجي:"}),xe.text]}),e.jsxs("div",{className:"space-y-3 pt-3 border-t border-white/[0.04]",children:[e.jsxs("div",{className:"flex justify-between items-center text-xs",children:[e.jsx("span",{className:"text-psy-text/40",children:"تباين الدرجات الكلية (s_T²):"}),e.jsx("span",{className:"font-mono text-white tracking-widest tabular-nums",children:p.totalVariance.toFixed(3)})]}),e.jsxs("div",{className:"flex justify-between items-center text-xs",children:[e.jsx("span",{className:"text-psy-text/40",children:"مجموع تباينات البنود (Σ s_i²):"}),e.jsx("span",{className:"font-mono text-white tracking-widest tabular-nums",children:p.sumItemVariances.toFixed(3)})]}),e.jsxs("div",{className:"flex justify-between items-center text-xs",children:[e.jsx("span",{className:"text-psy-text/40",children:"الخطأ القياسي للقياس (SEM):"}),e.jsx("span",{className:"font-mono text-psy-gold tracking-widest tabular-nums",children:(Math.sqrt(p.totalVariance)*Math.sqrt(Math.max(0,1-p.globalAlpha))).toFixed(3)})]})]}),e.jsxs("div",{className:"pt-4 border-t border-white/[0.04] space-y-2",children:[e.jsx("span",{className:"text-[10px] text-psy-text/45 font-bold block",children:"تصدير الملف المنهجي والمزامنة:"}),e.jsxs("button",{onClick:pe,className:"w-full py-2.5 bg-sky-500/10 hover:bg-sky-500 border border-sky-500/25 hover:text-white text-sky-400 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg",children:[e.jsx(ye,{size:12}),e.jsx("span",{children:"تصدير ملخص التحليل (PDF) 📄"})]}),e.jsxs("button",{onClick:de,className:"w-full py-2 bg-psy-gold/10 hover:bg-psy-gold border border-psy-gold/25 hover:text-psy-bg text-psy-gold text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer",children:[e.jsx(G,{size:12}),e.jsx("span",{children:"المزامنة السحابية وقفل السجل Lock"})]})]})]})]}),e.jsxs(f,{className:"p-6 border-white/5 text-right space-y-4",children:[e.jsxs("h5",{className:"font-black text-xs text-white flex items-center gap-1.5 border-b border-white/5 pb-2",children:[e.jsx(je,{size:14,className:"text-psy-gold"}),"تذكير إعداد المتغيرات بالـ SPSS:"]}),e.jsxs("ul",{className:"text-[11px] text-psy-text/50 leading-relaxed text-justify space-y-1.5 list-disc list-inside",children:[e.jsxs("li",{children:["تأكد من إبقاء حقل ",e.jsx("strong",{className:"text-white",children:"Decimal"})," للمقيم بـ 0 لتبسيط عرض قيم ليكرت."]}),e.jsxs("li",{children:["يرجى تعيين درجة قياس الاستجابة ",e.jsx("strong",{className:"text-white",children:"Measure"})," لـ ",e.jsx("strong",{className:"text-psy-gold",children:"Ordinal"})," أو ",e.jsx("strong",{className:"text-white",children:"Scale"})," لإخراجات صحيحة بالدليل الطبيعي."]}),e.jsx("li",{children:"قبل نسخ ولصق مصفوفتك من هنا، تأكد وبشكل تام بأن عدد الأعمدة النشطة وموقعها ببرنامج SPSS مطابق تماماً للمصفوفة الحالية."})]})]})]})]}),e.jsx(be,{children:Fe&&e.jsx("div",{className:"fixed inset-0 z-[160] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300",children:e.jsxs(ee.div,{initial:{scale:.95,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.95,opacity:0},className:"bg-psy-surface border border-psy-gold/20 w-full max-w-xl rounded-[28px] overflow-hidden shadow-2xl relative flex flex-col text-right",dir:"rtl",children:[e.jsx("div",{className:"absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-psy-gold to-transparent"}),e.jsx("div",{className:"p-5 border-b border-white/5 flex justify-between items-center bg-black/25",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"p-2 bg-psy-gold/10 rounded-xl text-psy-gold",children:e.jsx(O,{size:18})}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-sm font-black text-white",children:"استيراد دفعات استجابات من ملفات Excel و Word المادية"}),e.jsx("p",{className:"text-[10px] text-psy-text/40 mt-0.5 font-bold",children:"الصق مصفوفة الأرقام مباشرة وسيقوم البرنامج بضبط القياس والتهيئة"})]})]})}),e.jsxs("div",{className:"p-5 space-y-4",children:[e.jsxs("div",{className:"text-right",children:[e.jsx("span",{className:"text-[10.5px] font-black text-psy-text/40 block pb-1.5",children:"الدرجات للمفحوصين مفصولة بمسافة أو علامة جدولة (Tab) أو فاصلة (كما يتم نسخها من Excel أو ملف نصي):"}),e.jsx("textarea",{rows:8,value:Y,onChange:t=>U(t.target.value),placeholder:`مثال لصق سطر المبحوث الأول، المبحوث الثاني...
4 5 4
3 4 3
5 5 5
1 2 1`,className:"w-full bg-[#111110] border border-white/10 rounded-xl p-4 text-xs outline-none text-psy-gold font-mono focus:border-psy-gold leading-relaxed resize-none text-left",dir:"ltr"})]}),e.jsxs("div",{className:"bg-psy-gold/[0.02] border border-psy-gold/10 p-3 rounded-xl text-[10.5px] text-psy-text/50 leading-relaxed text-justify",children:["💡 ",e.jsx("strong",{children:"ملاحظة هامة:"})," تأكد من محاذاة البيانات وتساوي عدد الفقرات في كل صف. سيتم تلقائياً تحديث عدد الأعمدة والصفوف بالجدول التفاعلي الخارجي فوراً عند الاستيراد."]})]}),e.jsxs("div",{className:"p-4 border-t border-white/5 bg-black/40 flex justify-end gap-2.5",children:[e.jsx("button",{onClick:Je,className:"px-5 py-2.5 rounded-lg text-xs font-black bg-psy-gold text-psy-bg shadow-lg shadow-psy-gold/10 hover:opacity-90 transition-all cursor-pointer",children:"استيراد وتحليل فوري"}),e.jsx("button",{onClick:()=>{X(!1),U("")},className:"px-5 py-2.5 rounded-lg text-xs font-bold text-psy-text/50 hover:text-white hover:bg-white/5 transition-all cursor-pointer",children:"إلغاء وإغلاق"})]})]})})})]})},ft=()=>e.jsx(e.Fragment,{children:e.jsxs("div",{className:"space-y-6",children:[e.jsx(at,{to:"/lab/dashboard",label:"العودة للمختبر"}),e.jsx(rt,{})]})});export{ft as AnalysisPage};
