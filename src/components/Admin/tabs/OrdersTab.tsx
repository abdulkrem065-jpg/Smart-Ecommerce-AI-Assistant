import React, { useState } from 'react';
import { useStore } from '../../../store';
import { exportOrdersToCSV, printOrder } from "../../../core/exportUtils";
import { ClipboardList, CheckCircle2, AlertTriangle, AlertCircle, Trash, XIcon, Package, Printer } from 'lucide-react';
import { Order } from '../../../types';

export default function OrdersTab({ formatPrice }: { formatPrice: (p: number) => string }) {
  const orders = useStore((state) => state.orders);
  const updateOrderStatus = useStore((state) => state.updateOrderStatus);
  const deleteOrder = useStore((state) => state.deleteOrder);
  const currency = useStore((state) => state.tenantConfig.currency);

  const [selectedFund, setSelectedFund] = useState<string>('all');

  return (
    <div className="bg-[#0b1329] p-6 rounded-3xl border border-blue-900/40 shadow-sm space-y-4 animate-fade-in" id="orders-tab-section">
      <div className="flex justify-between items-center border-b border-blue-900/25 pb-4">
        <div>
          <h3 className="text-sm font-black text-white">سجل طلبات وحجوزات السلة المستلمة</h3>
          <p className="text-[10px] text-slate-400 mt-1">تتبع الطلبات الصادرة من الزبائن، غير حالات شحن الخدمة، واحذف الطلبيات المنتهية أو الملغية.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <select
            value={selectedFund}
            onChange={(e) => setSelectedFund(e.target.value)}
            className="bg-[#060b18] border border-blue-900/40 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-yellow-500/50"
          >
            <option value="all">كل طرق الدفع</option>
            <option value="البطاقة البنكية (Stripe / MyFatoorah / Tap)">البطاقات البنكية</option>
            <option value="محفظة حساب الجوال (Mobile Money)">محافظ الجوال</option>
            <option value="التحويل البنكي أو الكاش">تحويل بنكي / كاش</option>
          </select>
          <button onClick={() => exportOrdersToCSV(orders)} className="text-[10px] bg-green-500/15 text-green-400 font-black border border-green-500/25 px-3 py-1 rounded-full hover:bg-green-500/20 transition-colors shadow-sm">تصدير CSV 📥</button>
          <span className="text-[10px] bg-yellow-500/15 text-yellow-405 font-black border border-yellow-500/25 px-3 py-1 rounded-full">
            {orders.length} طلب
          </span>
        </div>
      </div>
      {orders.length === 0 ? (
        <div className="text-center py-16 text-slate-500 space-y-4">
          <ClipboardList className="w-14 h-14 mx-auto text-yellow-500/10 animate-pulse" />
          <div className="space-y-1">
            <p className="font-extrabold text-sm text-slate-450">لا يوجد طلبيات مسجلة حالياً بنظام الكبينة</p>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
              قم بوضع بعض المواد من المعرض في السلة الفاخرة ثم انقر فوق زر "إكمال وحجز المنتجات" لتجربة عملية الشحن الفوري ومشاهدة النتائج الرائعة هنا!
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.filter(o => selectedFund === 'all' || o.paymentMethod === selectedFund).map((order) => {
            const isCompleted = order.status === 'تم التجهيز للشحن' || order.status === 'تم التسليم 🟢';
            const isRejected = order.status === 'ملغي ❌' || order.status === 'مرفوض 🔴';
            const isPending = order.status === 'قيد المعالجة' || order.status === 'معلق ⏳';
            return (
              <div key={order.id} className={`p-4 rounded-2xl border transition-all relative overflow-hidden ${
                  isCompleted ? 'bg-emerald-950/20 border-emerald-900/40 shadow-[0_0_15px_rgba(16,185,129,0.05)]' : 
                  isRejected ? 'bg-red-950/20 border-red-900/40 opacity-75 grayscale-[20%]' : 
                  'bg-gradient-to-r from-blue-950/30 to-blue-900/10 border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.08)]'
                }`}>
                {isPending && <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-yellow-500/0 via-yellow-500/50 to-yellow-500/0 opacity-50 animate-pulse" />}
                
                <div className="flex flex-col lg:flex-row justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] font-mono text-blue-400 bg-blue-950/40 px-2 py-0.5 rounded-lg border border-blue-900/30">#{order.id.substring(0, 8)}</span>
                      <span className="text-[10px] text-slate-500 bg-black/20 px-2 py-0.5 rounded-lg border border-white/5">{order.date}</span>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="bg-[#060b18] p-3 rounded-xl border border-blue-900/30 min-w-[140px]">
                        <h4 className="font-extrabold text-sm text-yellow-400 mb-0.5">{order.customerName}</h4>
                        <p className="text-[11px] font-mono text-slate-300 font-black">{order.phone}</p>
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap gap-2 text-[10px]">
                          <span className="bg-[#0b1329] px-2 py-1 rounded-lg border border-blue-900/40 text-slate-300"><span className="text-slate-500 ml-1">العنوان:</span> {order.address || '-'}</span>
                          <span className="bg-[#0b1329] px-2 py-1 rounded-lg border border-blue-900/40 text-emerald-400 font-bold"><span className="text-slate-500 ml-1">الدفع:</span> {order.paymentMethod}</span>
                        </div>
                        {order.remittanceNumber && (
                           <div className="bg-yellow-500/10 border border-yellow-500/20 px-2 py-1.5 rounded-lg">
                              <span className="text-yellow-400 text-[10px] font-black block mb-0.5">رقم الحوالة المرجعي:</span>
                              <span className="text-white font-mono text-sm tracking-wider">{order.remittanceNumber}</span>
                           </div>
                        )}
                        {order.remittanceImage && (
                          <div className="mt-2">
                            <span className="text-yellow-400 text-[10px] font-black block mb-1">صورة إيصال التحويل:</span>
                            <a href={order.remittanceImage} target="_blank" rel="noreferrer" className="inline-block relative group">
                              <img src={order.remittanceImage} alt="إيصال التحويل" className="h-20 w-auto rounded-lg border-2 border-yellow-500/30 object-cover cursor-zoom-in transition-transform hover:scale-105" />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition-opacity pointer-events-none">
                                <span className="text-white text-[10px] font-bold">تكبير للصورة</span>
                              </div>
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between bg-black/20 p-3 rounded-xl border border-white/5 min-w-[200px]">
                    <div className="text-left w-full space-y-1 mb-3">
                      <p className="text-[10px] text-slate-500 font-bold">المجموع الكلي المطلق</p>
                      <p className="font-black text-xl text-white font-mono leading-none">
                         {formatPrice ? formatPrice(order.totalPrice) : order.totalPrice.toLocaleString()} {order.currency || currency}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 justify-end w-full">
                      {isPending && (
                        <>
                           <button onClick={() => updateOrderStatus(order.id, 'تم التجهيز للشحن')} className="flex items-center gap-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-3 py-1.5 rounded-lg hover:bg-yellow-500 hover:text-black transition-all text-xs font-bold flex-1 justify-center shadow-lg shadow-yellow-500/10">
                              <Package className="w-3.5 h-3.5" /> تجهيز وحزم
                           </button>
                           <button onClick={() => updateOrderStatus(order.id, 'تم التسليم 🟢')} className="flex items-center gap-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-lg hover:bg-emerald-500 hover:text-black transition-all text-xs font-bold flex-1 justify-center shadow-lg shadow-emerald-500/10">
                              <CheckCircle2 className="w-3.5 h-3.5" /> تسليم مباشر ✅
                           </button>
                        </>
                      )}
                      
                      {isCompleted && (
                         <div className="flex items-center gap-1.5 text-emerald-400 font-black text-xs bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg w-full justify-center">
                            <CheckCircle2 className="w-4 h-4" />
                            {order.status}
                         </div>
                      )}

                      {!isRejected && !isCompleted && (
                        <button onClick={() => updateOrderStatus(order.id, 'مرفوض 🔴')} className="p-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500 hover:text-white transition-colors" title="رفض الطلب">
                           <XIcon className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button onClick={() => printOrder(order, 'فاتورة كاشير')} className="p-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg hover:bg-blue-500 hover:text-white transition-colors" title="طباعة فاتورة كاشير صغيرة 🖨️">
                         <Printer className="w-3.5 h-3.5" />
                      </button>

                      <button onClick={() => {
                        if (window.confirm('هل أنت متأكد من حذف هذا الطلب نهائياً من سجلات الكبينة؟')) {
                          deleteOrder(order.id);
                        }
                      }} className="p-1.5 bg-slate-800 text-slate-400 border border-slate-700 rounded-lg hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 transition-colors" title="مسح من السجلات">
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-blue-900/20">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 bg-[#060b18] p-2 rounded-xl border border-blue-900/30 group hover:border-yellow-500/30 transition-colors">
                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-blue-950">
                          {item.product.image ? (
                            <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                          ) : (
                             <Package className="w-5 h-5 text-blue-700 m-auto mt-2" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="text-[10px] font-bold text-white truncate" title={item.product.name}>{item.product.name}</h5>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-[10px] text-slate-400">الكمية: <span className="font-bold text-yellow-400">{item.quantity}</span></span>
                            <span className="text-[10px] font-mono text-emerald-400">{(item.product.price * item.quantity).toLocaleString()}</span>
                          </div>
                          {(item.selectedColor || item.selectedFlavor || (item.selectedSubOptions && item.selectedSubOptions.length > 0)) && (
                            <div className="text-[9px] text-slate-500 truncate mt-0.5" title={`${item.selectedColor ? item.selectedColor + ' ' : ''}${item.selectedFlavor ? item.selectedFlavor + ' ' : ''}${item.selectedSubOptions?.map(so => `${so.name}(x${so.quantity})`).join(', ')}`}>
                              {item.selectedColor && <span className="mr-1 inline-block w-2 h-2 rounded-full align-middle border border-slate-600" style={{backgroundColor: item.selectedColor}}></span>}
                              {item.selectedFlavor && <span className="mr-1">{item.selectedFlavor}</span>}
                              {item.selectedSubOptions?.map(so => `${so.name}(x${so.quantity})`).join(', ')}
                            </div>
                          )}
                           {item.playerId && (
                             <div className="text-[9px] text-yellow-400 font-mono mt-0.5 truncate bg-yellow-900/20 px-1 py-0.5 rounded w-fit" title={`Player ID: ${item.playerId}`}>
                               🎮 ID: {item.playerId}
                             </div>
                           )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-[9px] text-slate-450 leading-normal bg-black/20 p-2 border border-blue-950 rounded-xl mt-3">
                    💡 يمكنك نسخ هذه المعطيات بضغطة زر وتوريدها للعميل يدوياً من تطبيق الموزع الخاص بك، ثم الضغط على زر <strong>(تسليم ✅)</strong> بالأعلى لتأمين انتهاء العملية.
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
