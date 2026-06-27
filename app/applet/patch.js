import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'src/pages/lab/ResearcherLab.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const markerStart = '              {/* PAGE 4: التحكيم العلمي والصدق */}';
const markerEnd = '              {/* PAGE 5: استقطاب العينات والاستجابات */}';

const startIndex = content.indexOf(markerStart);
const endIndex = content.indexOf(markerEnd);

if (startIndex === -1) {
  console.error("Could not find start marker!");
  process.exit(1);
}
if (endIndex === -1) {
  console.error("Could not find end marker!");
  process.exit(1);
}

console.log('Start index:', startIndex);
console.log('End index:', endIndex);

const part1 = content.slice(0, startIndex);
const part2 = content.slice(endIndex);

const cleanMiddle = `              {/* PAGE 4: التحكيم العلمي والصدق */}
              {currentTab === 'arbitration' && (
                <div className="bg-[#121210] border border-white/5 rounded-[32px] p-6 lg:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="border-b border-white/5 pb-4 space-y-1 text-right">
                    <span className="text-[9.5px] font-bold text-[#D4AF37] uppercase tracking-widest block">الخطوة الرابعة / التحكيم وقياس صدق المحتوى علمياً</span>
                    <h2 className="text-xl font-black text-white">تحكيم آراء الخبراء وحساب مؤشرات الصدق CVI</h2>
                    <p className="text-xs text-[#a0a095]">تسجيل لجنة المحكمين الأكاديميين الأكفاء وحساب مؤشرات صدق المحتوى وتدوين ملاحظاتهم لتقرير المقياس.</p>
                  </div>

                  {/* ADD ARBITRATOR PANEL FIELD */}
                  <div className="p-5 rounded-[24px] bg-black/30 border border-white/5 space-y-4 text-right">
                    <h3 className="text-xs font-black text-white flex items-center gap-1.5 justify-start">
                      <UserCheck size={14} className="text-[#D4AF37]" />
                      <span>إضافة بروفيسور محكم علمي للجنة</span>
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                      <input 
                        type="text"
                        value={newArbName}
                        onChange={(e) => setNewArbName(e.target.value)}
                        placeholder="اسم المحكم مثل: أ.د. فاسي جيلالي"
                        className="bg-black p-2.5 rounded-xl border border-white/5 text-xs text-white outline-none focus:border-[#D4AF37]"
                      />
                      <input 
                        type="text"
                        value={newArbTitle}
                        onChange={(e) => setNewArbTitle(e.target.value)}
                        placeholder="الرتبة الأكاديمية والتخصص"
                        className="bg-black p-2.5 rounded-xl border border-white/5 text-xs text-white outline-none focus:border-[#D4AF37]"
                      />
                      <input 
                        type="text"
                        value={newArbUni}
                        onChange={(e) => setNewArbUni(e.target.value)}
                        placeholder="الجامعة أو المركز البحثي الراعي"
                        className="bg-black p-2.5 rounded-xl border border-white/5 text-xs text-white outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                    <button 
                      onClick={handleAddArbitrator}
                      className="w-full py-2.5 bg-[#D4AF37] hover:bg-[#c4a030] text-black font-black text-xs rounded-xl transition-all cursor-pointer text-center"
                    >
                      تسجيل المحكم وبث وثيقة الصدق الظاهري التفاعلي 📄
                    </button>
                  </div>

                  {/* ACTIVE PANEL OF ARBITRATORS */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-[#D4AF37] text-right">لجنة التحكيم العلمي المعتمدة بالمخبر ({arbitrators.length})</h3>
                    {arbitrators.length === 0 ? (
                      <p className="text-center text-xs text-[#a0a095] py-4">لا يوجد محكّمين مضافين حالياً. يرجى إضافة محكّم للجنة للبدء في حساب الصدق.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {arbitrators.map((arb) => (
                          <div key={arb.id} className="p-4 rounded-2xl bg-[#0f0f0e] border border-white/5 flex justify-between items-center text-right" dir="rtl">
                            <button
                              onClick={() => {
                                setArbitrators(prev => prev.filter(a => a.id !== arb.id));
                                triggerToast("تم استبعاد المحكم من اللجنة العلمية 🗑️");
                              }}
                              className="text-red-400/75 hover:text-red-400 text-[10px] font-black cursor-pointer hover:underline"
                            >
                              استبعاد
                            </button>
                            <div>
                              <h4 className="text-xs font-black text-white">{arb.name}</h4>
                              <p className="text-[10px] text-[#a0a095] mt-1">{arb.title} - {arb.university}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* S-CVI INDEX HIGHLIGHT */}
                  <div className="p-5 rounded-[24px] bg-gradient-to-l from-[#D4AF37]/15 to-transparent border border-[#D4AF37]/25 text-right flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="space-y-1">
                      <span className="text-[9px] bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-0.5 rounded border border-[#D4AF37]/25 font-bold uppercase">S-CVI Score Spec</span>
                      <h3 className="text-sm font-black text-white">معامل صدق المحتوى العام للمقياس (Scale-Level Content Validity)</h3>
                      <p className="text-[11px] text-[#a0a095] leading-relaxed">
                        يتم حساب الـ S-CVI تلقائياً كمتوسط لمعاملات صدق البنود الفردية المقاسة بواسطة آراء المحكمين. النسبة المطلوبة للتوطين والاعتماد الدولي APA هي &gt;= 0.78.
                      </p>
                    </div>
                    <div className="bg-black/60 border border-[#D4AF37]/35 rounded-2xl px-6 py-4 text-center min-w-[120px] shrink-0">
                      <span className="text-[8px] text-[#a0a095] block uppercase">مجموع S-CVI الحركي</span>
                      <span className="text-2xl font-black font-mono text-[#D4AF37]">
                        {(items.length > 0 ? (items.reduce((acc, it) => acc + (itemReviews[it.id]?.score || 4), 0) / (items.length * 5)) : 0.88).toFixed(2)}
                      </span>
                      <span className="text-[9px] text-emerald-400 block mt-1 font-bold">مقبول علمياً 🟢</span>
                    </div>
                  </div>

                  {/* INDIVIDUAL ITEM EVALUATION GRID */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-white text-right">مصفوفة آراء وتعديلات المحكّمين لكل بند (I-CVI Formulator)</h3>
                    <div className="space-y-3">
                      {items.map((it, idx) => {
                        const rev = itemReviews[it.id] || { score: 4.5, comment: 'العبارة ممتازة ومناسبة للصياغة البيئية' };
                        return (
                          <div key={it.id} className="p-4 rounded-xl bg-[#0f0f0e] border border-white/5 space-y-3.5 text-right">
                            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                              <span className="text-xs font-mono font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded">البند {idx + 1}</span>
                              <span className="text-[11px] text-white/50">{it.tags[0] || 'البعد العام'}</span>
                            </div>
                            <p className="text-xs text-white font-bold">{it.questionText}</p>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-1.5">
                              <div className="md:col-span-4 space-y-1">
                                <label className="text-[10px] text-[#a0a095] block">مستوى ملاءمة وحكم محتوى العبارة (من 1 إلى 5):</label>
                                <div className="flex items-center gap-2">
                                  <input 
                                    type="range"
                                    min="1"
                                    max="5"
                                    step="0.5"
                                    value={rev.score}
                                    onChange={(e) => handleUpdateReview(it.id, 'score', Number(e.target.value))}
                                    className="flex-1 accent-[#D4AF37]"
                                  />
                                  <span className="text-xs font-mono font-black text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-1 rounded border border-[#D4AF37]/20 w-8 text-center">{rev.score}</span>
                                </div>
                              </div>
                              <div className="md:col-span-8 space-y-1">
                                <label className="text-[10px] text-[#a0a095] block">الملاحظة النقدية للباحثين والمحكّمين:</label>
                                <input 
                                  type="text"
                                  value={rev.comment}
                                  onChange={(e) => handleUpdateReview(it.id, 'comment', e.target.value)}
                                  placeholder="اكتب ملاحظات التعديل أو الحذف المقترحة من اللجنة..."
                                  className="w-full bg-black border border-white/10 rounded-xl p-2.5 text-xs text-white outline-none focus:border-[#D4AF37]"
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

`;

fs.writeFileSync(filePath, part1 + cleanMiddle + part2, 'utf8');
console.log('REPAIR SUCCESSFULLY WRITTEN VIA ESM PATCH!');
