import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Printer, Plus, Trash2 } from 'lucide-react';
import Navigation from '@/components/Navigation';

interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

interface ExpenseItem {
  id: string;
  name: string;
  amount: number;
}

const INITIAL_CHECKLIST: ChecklistItem[] = [
  { id: '1', label: '護照（效期大於6個月）', checked: false },
  { id: '2', label: '韓國網卡 / eSIM', checked: false },
  { id: '3', label: 'WOWPASS / T-Money', checked: false },
  { id: '4', label: '海外高回饋信用卡', checked: false },
  { id: '5', label: '轉接頭（220V 雙圓孔）', checked: false },
  { id: '6', label: '行動電源', checked: false },
  { id: '7', label: '個人常備藥物', checked: false },
  { id: '8', label: '手提袋（裝戰利品）', checked: false },
];

export default function Home() {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(INITIAL_CHECKLIST);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  // Load from localStorage
  useEffect(() => {
    const savedChecklist = localStorage.getItem('seoul-checklist');
    const savedExpenses = localStorage.getItem('seoul-expenses');
    
    if (savedChecklist) {
      try {
        setChecklist(JSON.parse(savedChecklist));
      } catch (e) {
        console.error('Failed to load checklist:', e);
      }
    }
    
    if (savedExpenses) {
      try {
        setExpenses(JSON.parse(savedExpenses));
      } catch (e) {
        console.error('Failed to load expenses:', e);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('seoul-checklist', JSON.stringify(checklist));
  }, [checklist]);

  useEffect(() => {
    localStorage.setItem('seoul-expenses', JSON.stringify(expenses));
  }, [expenses]);

  const toggleChecklistItem = (id: string) => {
    setChecklist(prev =>
      prev.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const addExpense = () => {
    if (expenseName.trim() && expenseAmount) {
      const newExpense: ExpenseItem = {
        id: Date.now().toString(),
        name: expenseName,
        amount: parseFloat(expenseAmount),
      };
      setExpenses(prev => [...prev, newExpense]);
      setExpenseName('');
      setExpenseAmount('');
    }
  };

  const removeExpense = (id: string) => {
    setExpenses(prev => prev.filter(item => item.id !== id));
  };

  const clearAllExpenses = () => {
    if (confirm('確定要清空所有記錄嗎？')) {
      setExpenses([]);
    }
  };

  const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
  const completedChecklist = checklist.filter(item => item.checked).length;
  const exchangeRate = 41; // 1 TWD ≈ 41 KRW

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section id="hero" className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-300 rounded-full blur-3xl"></div>
        </div>

        <div className="container relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-sm font-semibold text-primary mb-4 uppercase tracking-widest">
              FAMILY K-TRIP · 6大6小
            </p>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              首爾家族追星雙軌之旅
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              弘大為營 · 追星與休閒的完美平衡
            </p>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="px-6 py-3 bg-white rounded-lg border border-border shadow-sm">
                <p className="text-sm text-muted-foreground">旅遊日期</p>
                <p className="font-semibold text-foreground">2026.07.17 (五) ─ 2026.07.21 (二)</p>
              </div>
              <div className="px-6 py-3 bg-white rounded-lg border border-border shadow-sm">
                <p className="text-sm text-muted-foreground">天數</p>
                <p className="font-semibold text-foreground">5天4夜</p>
              </div>
            </div>
            <div className="accent-line mx-auto w-24"></div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="py-16 md:py-24 bg-secondary/50">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            旅途好幫手
          </h2>
          <div className="accent-line w-24 mb-12"></div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Checklist Card */}
            <Card className="p-6 md:p-8 card-hover">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-foreground">行李確認清單</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrint}
                  className="gap-2"
                >
                  <Printer size={16} />
                  列印
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                勾選後自動儲存（使用瀏覽器本地記憶）
              </p>

              <div className="space-y-3 mb-6">
                {checklist.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <Checkbox
                      id={item.id}
                      checked={item.checked}
                      onCheckedChange={() => toggleChecklistItem(item.id)}
                      className="cursor-pointer"
                    />
                    <label
                      htmlFor={item.id}
                      className={`text-sm cursor-pointer flex-1 ${
                        item.checked ? 'line-through text-muted-foreground' : 'text-foreground'
                      }`}
                    >
                      {item.label}
                    </label>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-sm font-semibold text-foreground">
                  {completedChecklist} / {checklist.length} 完成
                </p>
                <div className="w-full bg-secondary rounded-full h-2 mt-2">
                  <div
                    className="bg-gradient-to-r from-primary to-pink-400 h-2 rounded-full smooth-transition"
                    style={{ width: `${(completedChecklist / checklist.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </Card>

            {/* Expense Card */}
            <Card className="p-6 md:p-8 card-hover">
              <h3 className="text-2xl font-bold mb-6 text-foreground">家族公費記帳本</h3>
              <p className="text-sm text-muted-foreground mb-6">
                匯率約 1 TWD ≈ {exchangeRate} KRW（僅供參考）
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex gap-2">
                  <Input
                    id="exp-name"
                    placeholder="項目（例：橋村炸雞）"
                    value={expenseName}
                    onChange={(e) => setExpenseName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addExpense()}
                  />
                  <Input
                    id="exp-amount"
                    type="number"
                    placeholder="韓元 KRW"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addExpense()}
                    className="w-32"
                  />
                  <Button onClick={addExpense} size="sm" className="gap-2">
                    <Plus size={16} />
                  </Button>
                </div>
              </div>

              {expenses.length > 0 && (
                <div className="space-y-2 mb-6 max-h-48 overflow-y-auto">
                  {expenses.map(expense => (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">{expense.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {expense.amount.toLocaleString()} KRW
                        </p>
                      </div>
                      <button
                        onClick={() => removeExpense(expense.id)}
                        className="p-1 hover:bg-red-100 rounded smooth-transition"
                      >
                        <Trash2 size={16} className="text-destructive" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-semibold text-muted-foreground">總計</p>
                  <p className="text-2xl font-bold text-primary">
                    {totalExpense.toLocaleString()} ₩
                  </p>
                </div>
                {expenses.length > 0 && (
                  <p className="text-xs text-muted-foreground mb-4">
                    ≈ {Math.round(totalExpense / exchangeRate).toLocaleString()} TWD
                  </p>
                )}
                {expenses.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllExpenses}
                    className="w-full"
                  >
                    清空所有記錄
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section id="info" className="py-16 md:py-24">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            行程重要資訊
          </h2>
          <div className="accent-line w-24 mb-12"></div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Flight Info */}
            <Card className="p-6 card-hover">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl">✈️</div>
                <h3 className="text-lg font-bold text-foreground">航班資訊</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-foreground">去程 (7/17)</p>
                  <p className="text-muted-foreground">台灣虎航 IT662</p>
                  <p className="text-muted-foreground">16:00 高雄 (KHH) → 19:45 金浦 (GMP)</p>
                </div>
                <div className="pt-3 border-t border-border">
                  <p className="font-semibold text-foreground">回程 (7/21)</p>
                  <p className="text-muted-foreground">德威航空 TW671</p>
                  <p className="text-muted-foreground">13:05 仁川 (ICN) T1 → 15:10 高雄 (KHH)</p>
                </div>
              </div>
            </Card>

            {/* Accommodation */}
            <Card className="p-6 card-hover">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl">🏠</div>
                <h3 className="text-lg font-bold text-foreground">Airbnb 住宿</h3>
              </div>
              <div className="space-y-3 text-sm">
                <p className="text-muted-foreground">弘大</p>
                <div className="bg-secondary p-3 rounded-lg">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">韓文地址</p>
                  <p className="text-foreground">（向房東索取後填入）</p>
                </div>
                <div className="bg-secondary p-3 rounded-lg">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">大門密碼</p>
                  <p className="text-foreground">（向房東索取後填入）</p>
                </div>
                <p className="text-xs text-muted-foreground pt-2">
                  退房時限（一般 11:00），Day 5 請提早確認。
                </p>
              </div>
            </Card>

            {/* Tips */}
            <Card className="p-6 card-hover">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl">💡</div>
                <h3 className="text-lg font-bold text-foreground">實用攻略</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-foreground">🚇 交通</p>
                  <p className="text-muted-foreground text-xs">機場超商購買 WOWPASS 或 T-Money 儲值卡</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">🚖 叫車</p>
                  <p className="text-muted-foreground text-xs">大人手機必載 Kakao T（可綁台灣信用卡）</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">🍗 外送</p>
                  <p className="text-muted-foreground text-xs">下載 Creatrip App，輸入韓文地址＋密碼，LINE Pay 叫炸雞</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Itinerary Section */}
      <section id="itinerary" className="py-16 md:py-24 bg-secondary/50">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            逐日雙軌行程表
          </h2>
          <div className="accent-line w-24 mb-12"></div>

          <div className="space-y-8">
            {/* Day 1 */}
            <Card className="p-6 md:p-8 card-hover">
              <h3 className="text-2xl font-bold mb-2 text-foreground">Day 1 · 7/17 (五)</h3>
              <p className="text-primary font-semibold mb-6">抵達首爾與炸雞派對</p>
              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4">
                  <p className="text-sm font-semibold text-muted-foreground">19:45</p>
                  <p className="font-semibold text-foreground">🛬 抵達金浦機場（GMP）& 入境</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    搭乘 AREX 機場快線前往弘大，車程約 15 分鐘。建議在機場超商購買 T-Money / WOWPASS 儲值卡。
                  </p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <p className="text-sm font-semibold text-muted-foreground">21:30</p>
                  <p className="font-semibold text-foreground">🏡 弘大 Airbnb Check-in</p>
                  <p className="text-sm text-muted-foreground mt-2">安頓行李，整理住宿。</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <p className="font-semibold text-foreground">🍗 宵夜：Creatrip 叫外送炸雞派對</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    全家安頓後，用 Creatrip App 點半半炸雞，在客廳舉辦第一晚接風派對！
                  </p>
                </div>
              </div>
            </Card>

            {/* Day 2 */}
            <Card className="p-6 md:p-8 card-hover">
              <h3 className="text-2xl font-bold mb-2 text-foreground">Day 2 · 7/18 (六)</h3>
              <p className="text-primary font-semibold mb-6">江南潮流與追星初體驗 · 雙軌日</p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    🌟 追星小隊
                  </p>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="font-medium text-foreground">上午</p>
                      <p className="text-muted-foreground">JYP 娛樂朝聖（江東區），應援咖啡廳巡禮</p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">下午</p>
                      <p className="text-muted-foreground">K-Pop Square（三成站），觀賞巨型 3D 螢幕廣告</p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">傍晚</p>
                      <p className="text-muted-foreground">AK Plaza（弘大），逛 Withmuu 購買專輯周邊</p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    ☕ 觀光小隊
                  </p>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="font-medium text-foreground">上午</p>
                      <p className="text-muted-foreground">樂天世界塔 Seoul Sky，登高俯瞰首爾全景</p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">下午</p>
                      <p className="text-muted-foreground">星空圖書館 & COEX Mall，拍照購物吹冷氣</p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">傍晚</p>
                      <p className="text-muted-foreground">延南洞漫步，逛文青小店與京義線林蔭道</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-border">
                <p className="font-semibold text-foreground flex items-center gap-2 mb-2">
                  🤝 晚餐會合：弘大商圈
                </p>
                <p className="text-sm text-muted-foreground">
                  推薦給豚的男人或八色烤肉，飯後欣賞弘大 Busking 街頭表演。
                </p>
              </div>
            </Card>

            {/* Day 3 */}
            <Card 
              className="p-6 md:p-8 cursor-pointer transition-all duration-300 hover:shadow-lg"
              onClick={() => setExpandedDay(expandedDay === 'day3' ? null : 'day3')}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 text-foreground">Day 3 · 7/19 (日)</h3>
                  <p className="text-primary font-semibold mb-3">聖水洞布魯克林與漢江之夜</p>
                  {expandedDay === 'day3' && (
                    <div className="space-y-3 text-sm mt-4 pt-4 border-t border-border">
                      <div>
                        <p className="font-semibold text-foreground flex items-center gap-2 mb-2">🌟 追星小隊</p>
                        <div className="space-y-2 text-muted-foreground">
                          <p><span className="font-medium text-foreground">上午</span> Cube 娛樂大樓朝聖（聖水洞），尋找 (G)I-DLE 足跡</p>
                          <p><span className="font-medium text-foreground">下午</span> 聖水洞各大 K-Pop Pop-up Store 快閃店巡禮</p>
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground flex items-center gap-2 mb-2">☕ 觀光小隊</p>
                        <div className="space-y-2 text-muted-foreground">
                          <p><span className="font-medium text-foreground">上午</span> 首爾林散步踏青，享受都市叢林自然寧靜</p>
                          <p><span className="font-medium text-foreground">下午</span> Dior 概念店打卡，Cafe Onion 老屋喝咖啡</p>
                        </div>
                      </div>
                      <div className="pt-3 border-t border-border">
                        <p className="font-semibold text-foreground flex items-center gap-2">🤝 晚餐會合：纛島漢江公園</p>
                        <p className="text-muted-foreground text-xs mt-2">全家在漢江邊叫外送野餐（炸醬麵或炸雞），體驗韓國最道地的夏日傍晚。</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="ml-4 text-primary text-xl font-bold">{expandedDay === 'day3' ? '▼' : '▶'}</div>
              </div>
            </Card>

            {/* Day 4 */}
            <Card 
              className="p-6 md:p-8 cursor-pointer transition-all duration-300 hover:shadow-lg"
              onClick={() => setExpandedDay(expandedDay === 'day4' ? null : 'day4')}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 text-foreground">Day 4 · 7/20 (一)</h3>
                  <p className="text-primary font-semibold mb-3">傳統韓服與最後血拼</p>
                  {expandedDay === 'day4' && (
                    <div className="space-y-3 text-sm mt-4 pt-4 border-t border-border">
                      <div>
                        <p className="font-semibold text-foreground flex items-center gap-2 mb-2">🌟 追星小隊</p>
                        <div className="space-y-2 text-muted-foreground">
                          <p><span className="font-medium text-foreground">上午</span> 明洞 Music Korea 尋找絕版專輯，逛 Olive Young 旗艦店</p>
                          <p><span className="font-medium text-foreground">下午</span> 弘大／合井 Soundwave，最後補齊遺漏周邊</p>
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground flex items-center gap-2 mb-2">☕ 觀光小隊</p>
                        <div className="space-y-2 text-muted-foreground">
                          <p><span className="font-medium text-foreground">上午</span> 景福宮 & 韓服體驗，拍下美好家族合照</p>
                          <p><span className="font-medium text-foreground">下午</span> 益善洞韓屋村，穿梭傳統改建文青巷弄</p>
                        </div>
                      </div>
                      <div className="pt-3 border-t border-border">
                        <p className="font-semibold text-foreground flex items-center gap-2">🤝 晚餐會合：廣藏市場 或 東大門</p>
                        <p className="text-muted-foreground text-xs mt-2">品嚐綠豆煎餅、麻藥紫菜包飯，或到東大門吃陳玉華一隻雞，飯後逛 DDP 建築夜景。</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="ml-4 text-primary text-xl font-bold">{expandedDay === 'day4' ? '▼' : '▶'}</div>
              </div>
            </Card>

            {/* Day 5 */}
            <Card 
              className="p-6 md:p-8 cursor-pointer transition-all duration-300 hover:shadow-lg"
              onClick={() => setExpandedDay(expandedDay === 'day5' ? null : 'day5')}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 text-foreground">Day 5 · 7/21 (二)</h3>
                  <p className="text-primary font-semibold mb-3">滿載而歸</p>
                  {expandedDay === 'day5' && (
                    <div className="space-y-3 text-sm mt-4 pt-4 border-t border-border">
                      <div>
                        <p className="text-sm font-semibold text-muted-foreground">08:00</p>
                        <p className="font-semibold text-foreground">🏡 整理退房</p>
                        <p className="text-muted-foreground">打包行李、整理房間，於退房時限前完成（請提前向房東確認時間，一般為 11:00）。</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-muted-foreground">08:30</p>
                        <p className="font-semibold text-foreground">☕ 簡易早餐</p>
                        <p className="text-muted-foreground">在附近便利商店買早餐，最後感受弘大早晨的悠閒。</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-muted-foreground">09:30</p>
                        <p className="font-semibold text-foreground">🚆 出發前往仁川機場</p>
                        <p className="text-muted-foreground">搭乘 AREX 前往仁川機場 T1，車程約 55 分鐘。建議 10:30 前抵達（起飛前 2.5 小時）。</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-muted-foreground">13:05 起飛</p>
                        <p className="font-semibold text-foreground">🛫 德威航空 TW671 仁川 → 高雄</p>
                        <p className="text-muted-foreground">帶著滿滿回憶與戰利品飛回高雄，預計 15:10 抵達。</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="ml-4 text-primary text-xl font-bold">{expandedDay === 'day5' ? '▼' : '▶'}</div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-foreground text-white">
        <div className="container text-center">
          <p className="text-sm mb-2">首爾家族追星雙軌之旅 2026 · Created with ♥</p>
          <p className="text-xs text-gray-400">點擊右上角按鈕列印或儲存為 PDF</p>
        </div>
      </footer>
    </div>
  );
}
