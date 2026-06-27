import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LabTestPlayer } from '../../components/lab/LabTestPlayer';
import { getTestById, saveTest, PsychTest, QuestionType } from '../../lib/lab';

export const PublicTestPlayer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [test, setTest] = useState<PsychTest | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const loadTest = async () => {
      if (!id) return;
      setIsLoading(true);
      setErrorMsg(null);

      // 1. Try to look up locally
      const localTest = getTestById(id);
      if (localTest) {
        setTest(localTest);
        setIsLoading(false);
        return;
      }

      // 2. Fallback: Fetch active test builder state from server
      try {
        const response = await fetch('/api/testbuilder/state');
        const json = await response.json();
        
        if (json.success && json.state && json.state.testData) {
          const backendData = json.state;
          
          // Construct the PsychTest object cleanly
          const backendTest: PsychTest = {
            id: backendData.testData.id,
            title: backendData.testData.title || "مقياس سيكومتري تفاعلي",
            description: backendData.testData.description || "استقصاء ميداني علمي لجمع العينة البحثية وتقنين المقياس النفسي",
            instructions: "يرجى الإجابة على هذه الأسئلة بصدق وموضوعية.",
            category: "custom",
            targetPopulation: {
              ageRange: "18-65",
              gender: "both",
              languages: ["ar"],
              culturalContext: "عربي"
            },
            estimatedTime: 10,
            items: (backendData.testData.items || []).map((item: any, idx: number) => ({
              id: item.id || `item-${idx}`,
              testId: backendData.testData.id,
              orderIndex: idx,
              questionText: item.text || item.questionText,
              questionType: QuestionType.LIKERT_5,
              options: item.options || [
                { id: "1", label: "أبداً", value: 1 },
                { id: "2", label: "نادراً", value: 2 },
                { id: "3", label: "أحياناً", value: 3 },
                { id: "4", label: "غالباً", value: 4 },
                { id: "5", label: "دائماً", value: 5 }
              ],
              isRequired: true,
              reverseScored: false,
              tags: []
            })),
            scales: [],
            settings: {
              allowBacktracking: true,
              showProgressBar: true,
              randomizeItems: false,
              showResultsImmediately: true,
              requireAllAnswers: true,
              adaptiveTesting: false
            },
            translations: [],
            researchStudies: [],
            version: 1,
            status: "draft",
            authorId: "researcher-1",
            authorName: "باحث رئيسي",
            license: "free",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          // Save it in respondent local storage under psytech_lab_pro and TESTS
          saveTest(backendTest);
          localStorage.setItem('psytech_lab_pro', JSON.stringify(backendData));

          setTest(backendTest);
        } else {
          setErrorMsg("عذراً، لم نتمكن من العثور على هذا الاختبار في المنظومة حالياً.");
        }
      } catch (err) {
        console.error("Failed to load test from server:", err);
        setErrorMsg("حدث عطل أثناء الاتصال بالخادم، يرجى التحقق من اتصالك بالإنترنت.");
      } finally {
        setIsLoading(false);
      }
    };

    loadTest();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#181816] flex flex-col items-center justify-center text-psy-gold font-bold space-y-4" dir="rtl">
        <span className="w-8 h-8 rounded-full border-2 border-t-psy-gold border-white/5 animate-spin" />
        <span className="text-sm font-black text-psy-text/60">جاري قراءة تفاصيل المقياس وتأمين بوابات العينات...</span>
      </div>
    );
  }

  if (errorMsg || !test) {
    return (
      <div className="min-h-screen bg-[#181816] flex flex-col items-center justify-center text-psy-gold font-bold p-8 space-y-4 text-center" dir="rtl">
        <span className="text-4xl">⚠️</span>
        <h2 className="text-lg font-black text-white">{errorMsg || "المقياس غير متوفر"}</h2>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-psy-gold/10 hover:bg-psy-gold/20 border border-psy-gold text-psy-gold text-xs rounded-xl transition-all"
        >
          العودة للمنصة الرئيسية
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#181816]">
      <LabTestPlayer 
        test={test} 
        mode="live" 
        onClose={() => navigate(-1)} 
        onComplete={() => {
           // Show final message or redirect
        }}
      />
    </div>
  );
};
