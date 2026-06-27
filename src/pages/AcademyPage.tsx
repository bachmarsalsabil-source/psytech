import React, { memo } from 'react';
import { Plus, Users } from 'lucide-react';
import { OptimizedImage } from '../components/shared/OptimizedImage';

const COURSES = [
  {
    title: 'أساسيات العلاج المعرفي السلوكي',
    instructor: 'د. سارة المنصور',
    students: 120,
    img: 'https://images.unsplash.com/photo-1617791160505-6f00504e3519',
  },
  {
    title: 'تقنيات القياس النفسي المتقدمة',
    instructor: 'أ. خالد العتيبي',
    students: 85,
    img: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31',
  },
  {
    title: 'تحليل البيانات في البحث النفسي',
    instructor: 'د. محمد العبدالله',
    students: 240,
    img: 'https://images.unsplash.com/photo-1559757175-5700dde675bc',
  },
] as const;

export const AcademyPage = memo(function AcademyPage() {
  return (
    <div className="page-section min-h-screen pt-24 md:pt-28">
      <div className="text-center mb-10 md:mb-14">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">
          أكاديمية <span className="text-psy-gold">PsyTech</span>
        </h2>
        <p className="text-psy-text/50 mb-0 max-w-xl mx-auto">
          برامج تدريبية وورشات عمل تخصصية لتطوير مهاراتك المهنية
        </p>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
        {COURSES.map((course) => (
          <article key={course.title} className="glass overflow-hidden group">
            <div className="h-40 md:h-44 overflow-hidden relative">
              <OptimizedImage
                src={course.img}
                alt={course.title}
                width={480}
                className="w-full h-full group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-psy-bg/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="w-11 h-11 bg-psy-gold text-psy-bg rounded-full flex items-center justify-center">
                  <Plus size={22} aria-hidden="true" />
                </span>
              </div>
            </div>
            <div className="p-5 md:p-6">
              <h3 className="font-bold text-base md:text-lg mb-2">{course.title}</h3>
              <div className="text-sm text-psy-text/50 mb-4">{course.instructor}</div>
              <div className="flex justify-between items-center pt-4 border-t border-white/5">
                <div className="text-xs text-psy-text/40 flex items-center gap-1">
                  <Users size={14} aria-hidden="true" /> {course.students} طالب
                </div>
                <button type="button" className="btn-ghost btn-sm min-h-0">
                  التفاصيل
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
});
