// Classroom demo only: credentials are visible in the page source. Do not use for real financial data.
const DEMO_USER='lecturer', DEMO_PASS='Expense@2026';
const $=id=>document.getElementById(id); let expenses=JSON.parse(localStorage.getItem('bet_expenses')||'[]'); let budget=Number(localStorage.getItem('bet_budget')||0);
function todayLocal(){const d=new Date();const y=d.getFullYear();const m=String(d.getMonth()+1).padStart(2,'0');const day=String(d.getDate()).padStart(2,'0');return `${y}-${m}-${day}`}
$('date').value=todayLocal();
$('loginForm').addEventListener('submit',e=>{e.preventDefault();if($('username').value===DEMO_USER&&$('password').value===DEMO_PASS){sessionStorage.setItem('bet_logged','yes');showApp()}else $('error').textContent='Incorrect username or password.'});
function showApp(){ $('login').hidden=true;$('app').hidden=false; $('budget').value=budget||'';render() }
$('logout').onclick=()=>{sessionStorage.removeItem('bet_logged');$('app').hidden=true;$('login').hidden=false;$('password').value=''};
$('expenseForm').addEventListener('submit',e=>{e.preventDefault();expenses.push({id:Date.now(),date:$('date').value,description:$('description').value.trim(),category:$('category').value,amount:Number($('amount').value)});save();$('expenseForm').reset();$('date').value=todayLocal()});
$('budgetForm').addEventListener('submit',e=>{e.preventDefault();budget=Number($('budget').value);localStorage.setItem('bet_budget',budget);render()});
$('search').addEventListener('input',render);
function save(){localStorage.setItem('bet_expenses',JSON.stringify(expenses));render()}
function money(n){return '₹'+Number(n).toFixed(2)}
function render(){let total=expenses.reduce((s,x)=>s+x.amount,0),remaining=budget-total;$('total').textContent=money(total);$('count').textContent=expenses.length;$('budgetStat').textContent=money(budget);$('remaining').textContent=remaining<0?`Over budget by ${money(Math.abs(remaining))}`:money(remaining);$('remaining').classList.toggle('danger',remaining<0);$('remaining').parentElement.querySelector('span').textContent=remaining<0?'Budget alert':'Remaining Budget';let q=$('search').value.toLowerCase();let list=expenses.filter(x=>(x.date+' '+x.description+' '+x.category).toLowerCase().includes(q));$('rows').innerHTML=list.length?list.map(x=>`<tr><td>${esc(x.date)}</td><td>${esc(x.description)}</td><td>${esc(x.category)}</td><td>${money(x.amount)}</td><td><button class="delete" onclick="removeExpense(${x.id})">Delete</button></td></tr>`).join(''):'<tr><td colspan="5" class="empty">No expenses added yet.</td></tr>'}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
window.removeExpense=id=>{if(confirm('Delete this expense?')){expenses=expenses.filter(x=>x.id!==id);save()}};
$('export').onclick=()=>{let lines=[['Date','Description','Category','Amount'],...expenses.map(x=>[x.date,x.description,x.category,x.amount])];let csv=lines.map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\n');let a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='business_expenses.csv';a.click();URL.revokeObjectURL(a.href)};
if(sessionStorage.getItem('bet_logged')==='yes')showApp();
