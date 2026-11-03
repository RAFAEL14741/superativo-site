/* SuperAtivo site: EN / PT (Brazil) / ES. Keys = the English text exactly as it sits on the page.
   Static text nodes + alt/aria-label are swapped in place; live parts (hours, day picker, chat, goal word,
   WhatsApp messages) re-render through I18N.on(). Choice is remembered per browser. */
(() => {
const D = {
  // header + nav
  'Classes': ['Aulas', 'Clases'],
  'Coaching': ['Consultoria', 'Coaching'],
  'Nutrition': ['Nutrição', 'Nutrición'],
  'Hours': ['Horários', 'Horario'],
  'Main': ['Principal', 'Principal'],
  'Language': ['Idioma', 'Idioma'],
  // hero
  'Stage-tested coaching on Ashton Rd.': ['Treino com quem já competiu, na Ashton Rd.', 'Entrena con competidores, en Ashton Rd.'],
  'Witor, Jhennyffer and Larissa have all competed on stage. Train with them in semi-private classes, or get online coaching and a meal plan. Since 2015.':
    ['Witor, Jhennyffer e Larissa já competiram no palco. Treine com eles em aulas semi-privadas ou faça consultoria online com plano alimentar. Desde 2015.',
     'Witor, Jhennyffer y Larissa han competido en el escenario. Entrena con ellos en clases semiprivadas o recibe coaching en línea con plan de alimentación. Desde 2015.'],
  '14 Google reviews': ['14 avaliações no Google', '14 reseñas en Google'],
  'Scroll to see what we do': ['Role para ver o que fazemos', 'Desliza para ver lo que hacemos'],
  // classes
  'Small classes. A coach on every rep.': ['Turmas pequenas. Um coach em cada repetição.', 'Clases pequeñas. Un coach en cada repetición.'],
  'Classes run 1 hour or more, mornings and evenings, for building muscle, losing weight or gaining lean mass. Pick the days that fit your week.':
    ['As aulas duram 1 hora ou mais, de manhã e à noite, para ganhar músculo, perder peso ou ganhar massa magra. Escolha os dias que cabem na sua semana.',
     'Las clases duran 1 hora o más, en la mañana y en la noche, para ganar músculo, bajar de peso o ganar masa magra. Elige los días que te funcionen.'],
  'Class time': ['Horário da aula', 'Horario de clase'],
  'Mornings': ['Manhãs', 'Mañanas'],
  'Evenings': ['Noites', 'Noches'],
  'Mon': ['Seg', 'Lun'], 'Tue': ['Ter', 'Mar'], 'Wed': ['Qua', 'Mié'], 'Thu': ['Qui', 'Jue'], 'Fri': ['Sex', 'Vie'], 'Sat': ['Sáb', 'Sáb'], 'Sun': ['Dom', 'Dom'],
  'No class': ['Sem aula', 'Sin clase'],
  'mornings': ['manhãs', 'mañanas'],
  'evenings': ['noites', 'noches'],
  'a week': ['por semana', 'a la semana'],
  'and': ['e', 'y'],
  'Pick at least 2 days.': ['Escolha pelo menos 2 dias.', 'Elige al menos 2 días.'],
  'Message us these days': ['Fale com a gente sobre esses dias', 'Escríbenos con estos días'],
  'Fixed weekly price. Cash or card at the front desk.': ['Preço fixo por semana. Dinheiro ou cartão na recepção.', 'Precio fijo semanal. Efectivo o tarjeta en la recepción.'],
  // coaching
  'Online coaching, right on WhatsApp.': ['Consultoria online, direto no WhatsApp.', 'Coaching en línea, directo en WhatsApp.'],
  'Train anywhere. Your plan comes straight from your coach, in Portuguese, English or Spanish.':
    ['Treine onde estiver. Seu plano vem direto do seu coach, em português, inglês ou espanhol.',
     'Entrena donde estés. Tu plan viene directo de tu coach, en portugués, inglés o español.'],
  'Chat language': ['Idioma da conversa', 'Idioma del chat'],
  'Example coaching chat': ['Exemplo de conversa da consultoria', 'Ejemplo de chat de coaching'],
  'Coach': ['Coach', 'Coach'],
  'Example chat. The timings are real.': ['Conversa de exemplo. Os prazos são reais.', 'Chat de ejemplo. Los tiempos son reales.'],
  '1 month': ['1 mês', '1 mes'],
  '3 months': ['3 meses', '3 meses'],
  '6 months': ['6 meses', '6 meses'],
  'Cash, card or Venmo': ['Dinheiro, cartão ou Venmo', 'Efectivo, tarjeta o Venmo'],
  'Message us about coaching': ['Fale com a gente sobre a consultoria', 'Escríbenos sobre el coaching'],
  // nutrition
  'A meal plan to': ['Um plano alimentar para', 'Un plan de alimentación para'],
  'Your goal': ['Seu objetivo', 'Tu objetivo'],
  'Lose weight': ['Perder peso', 'Bajar de peso'],
  'Build muscle': ['Ganhar massa', 'Ganar músculo'],
  'Get stage-ready': ['Preparação para palco', 'Preparación para competir'],
  'lose weight': ['perder peso', 'bajar de peso'],
  'build muscle': ['ganhar massa muscular', 'ganar músculo'],
  'get stage-ready': ['se preparar para competir', 'prepararte para competir'],
  'Your coach writes it for you only, together with your training plan, and sends it on WhatsApp.':
    ['Seu coach monta só para você, junto com o seu treino, e envia pelo WhatsApp.',
     'Tu coach lo arma solo para ti, junto con tu plan de entrenamiento, y te lo envía por WhatsApp.'],
  'Today': ['Hoje', 'Hoy'],
  'Message us': ['Fale com a gente', 'Escríbenos'],
  'Tell us your goal on WhatsApp.': ['Conte seu objetivo pelo WhatsApp.', 'Cuéntanos tu objetivo por WhatsApp.'],
  '5 to 7 business days': ['5 a 7 dias úteis', '5 a 7 días hábiles'],
  'Get your plan': ['Receba seu plano', 'Recibe tu plan'],
  'Your meals and your training, made only for you.': ['Suas refeições e seu treino, feitos só para você.', 'Tus comidas y tu entrenamiento, hechos solo para ti.'],
  'Within 24 to 36 business hours': ['Em 24 a 36 horas úteis', 'En 24 a 36 horas hábiles'],
  'Ask anything about it': ['Tire qualquer dúvida', 'Pregunta lo que quieras'],
  'Write to your coach on WhatsApp, Mon to Fri, 8 AM to 5 PM.': ['Escreva para o seu coach no WhatsApp, de segunda a sexta, das 8h às 17h.', 'Escríbele a tu coach por WhatsApp, de lunes a viernes, de 8 AM a 5 PM.'],
  'About every 15 business days': ['Mais ou menos a cada 15 dias úteis', 'Más o menos cada 15 días hábiles'],
  'Your plan keeps up with you': ['Seu plano acompanha você', 'Tu plan avanza contigo'],
  'Your coach adjusts it from your check-ins and progress. Each update arrives in 3 to 5 business days.':
    ['Seu coach ajusta conforme seus check-ins e sua evolução. Cada atualização chega em 3 a 5 dias úteis.',
     'Tu coach lo ajusta según tus check-ins y tu progreso. Cada actualización llega en 3 a 5 días hábiles.'],
  'Follow at least 80% of your plan for 2 weeks to get your update. Be honest in your check-ins. No judgment here.':
    ['Siga pelo menos 80% do plano por 2 semanas para receber sua atualização. Seja sincero nos check-ins. Aqui ninguém julga.',
     'Sigue al menos el 80% de tu plan por 2 semanas para recibir tu actualización. Sé honesto en tus check-ins. Aquí nadie te juzga.'],
  'Ask for a meal plan': ['Pedir um plano alimentar', 'Pedir un plan de alimentación'],
  // story
  'House to house': ['De casa em casa', 'De casa en casa'],
  'Witor starts coaching people at home, going house to house with his training plans.':
    ['Witor começa a treinar pessoas em casa, indo de casa em casa com seus planos de treino.',
     'Witor empieza a entrenar a personas en casa, yendo de casa en casa con sus planes de entrenamiento.'],
  'Home training': ['Treino em casa', 'Entrenamiento en casa'],
  '9350 Ashton Rd opens': ['Abre a 9350 Ashton Rd', 'Abre 9350 Ashton Rd'],
  'Witor opens his own gym at 9350 Ashton Rd in Northeast Philly, with room for small group classes.':
    ['Witor abre sua própria academia na 9350 Ashton Rd, no Nordeste da Filadélfia, com espaço para aulas em grupos pequenos.',
     'Witor abre su propio gimnasio en 9350 Ashton Rd, en el noreste de Filadelfia, con espacio para clases en grupos pequeños.'],
  'Semi-private classes': ['Aulas semi-privadas', 'Clases semiprivadas'],
  'Northeast Philly': ['Nordeste da Filadélfia', 'Noreste de Filadelfia'],
  'Three coaches. Same gym.': ['Três coaches. A mesma academia.', 'Tres coaches. El mismo gimnasio.'],
  'Witor, Jhennyffer and Larissa, all three stage competitors, coach at SuperAtivo: classes, online coaching and meal plans, in English, Portuguese or Spanish.':
    ['Witor, Jhennyffer e Larissa, os três atletas de palco, são os coaches da SuperAtivo: aulas, consultoria online e planos alimentares, em inglês, português ou espanhol.',
     'Witor, Jhennyffer y Larissa, los tres competidores, son los coaches de SuperAtivo: clases, coaching en línea y planes de alimentación, en inglés, portugués o español.'],
  'Online coaching': ['Consultoria online', 'Coaching en línea'],
  'Meal plans': ['Planos alimentares', 'Planes de alimentación'],
  'Stage prep': ['Preparação para palco', 'Preparación para competir'],
  '★ 4.7 on Google': ['★ 4.7 no Google', '★ 4.7 en Google'],
  '“Here you don\'t just find a gym, but a place that inspires and transforms.”':
    ['“Aqui você não encontra só uma academia, mas um lugar que inspira e transforma.”',
     '“Aquí no solo encuentras un gimnasio, sino un lugar que inspira y transforma.”'],
  'From the SuperAtivo welcome guide': ['Do guia de boas-vindas da SuperAtivo', 'De la guía de bienvenida de SuperAtivo'],
  'Witor training a client at home in 2014': ['Witor treinando um cliente em casa em 2014', 'Witor entrenando a un cliente en casa en 2014'],
  'The first SuperAtivo gym in 2015': ['A primeira academia SuperAtivo, em 2015', 'El primer gimnasio SuperAtivo, en 2015'],
  'The SuperAtivo gym floor today': ['A academia SuperAtivo hoje', 'El gimnasio SuperAtivo hoy'],
  // rules
  'Before your first class.': ['Antes da sua primeira aula.', 'Antes de tu primera clase.'],
  'Your first visit': ['Sua primeira visita', 'Tu primera visita'],
  'Come 10 to 15 minutes early to warm up on the treadmill or bike, fill your bottle and use the restroom.':
    ['Chegue 10 a 15 minutos antes para aquecer na esteira ou na bike, encher sua garrafa e ir ao banheiro.',
     'Llega 10 a 15 minutos antes para calentar en la caminadora o la bici, llenar tu botella y pasar al baño.'],
  'Phones stay away during class. Handle messages and calls before or after.':
    ['O celular fica de lado durante a aula. Responda mensagens e ligações antes ou depois.',
     'El celular se queda a un lado durante la clase. Atiende mensajes y llamadas antes o después.'],
  'This hour is yours. Take your time.': ['Essa hora é sua. Aproveite.', 'Esta hora es tuya. Tómate tu tiempo.'],
  'Your training days': ['Seus dias de treino', 'Tus días de entrenamiento'],
  'Your class days are fixed each week.': ['Seus dias de aula são fixos toda semana.', 'Tus días de clase son fijos cada semana.'],
  'A missed class is still charged, even with notice.': ['Aula perdida é cobrada, mesmo com aviso.', 'Una clase perdida se cobra igual, aunque avises.'],
  'Emergencies, illness or travel are the only exceptions.': ['Só emergências, doença ou viagem são exceção.', 'Las únicas excepciones son emergencias, enfermedad o viajes.'],
  'Online coaching rules': ['Regras da consultoria online', 'Reglas del coaching en línea'],
  'Questions go to your coach in writing on WhatsApp, about your plan. Voice notes only if you ask first.':
    ['Dúvidas sobre o plano vão por escrito para o seu coach no WhatsApp. Áudio só se você pedir antes.',
     'Las preguntas sobre tu plan van por escrito a tu coach en WhatsApp. Notas de voz solo si lo pides antes.'],
  'Your package starts the day your first plan is sent. Payments are not refunded.':
    ['Seu pacote começa no dia em que o primeiro plano é enviado. Pagamentos não são reembolsados.',
     'Tu paquete empieza el día que se envía tu primer plan. Los pagos no se reembolsan.'],
  'Plans are updated when you follow at least 80% of the routine for 2 weeks.':
    ['Os planos são atualizados quando você segue pelo menos 80% da rotina por 2 semanas.',
     'Los planes se actualizan cuando sigues al menos el 80% de la rutina por 2 semanas.'],
  'Your plan is made for you only, so please keep it private.':
    ['Seu plano é feito só para você, então mantenha ele em particular.',
     'Tu plan es solo para ti, así que mantenlo en privado.'],
  'Late updates or payments get two reminders, then your spot goes to the next person.':
    ['Atualizações ou pagamentos atrasados recebem dois lembretes. Depois, sua vaga vai para a próxima pessoa.',
     'Las actualizaciones o pagos atrasados reciben dos recordatorios. Después, tu lugar pasa a la siguiente persona.'],
  // hours + visit
  "When we're open": ['Quando estamos abertos', 'Cuándo abrimos'],
  'Weekly gym hours and class times': ['Horários da academia e das aulas', 'Horario del gimnasio y de las clases'],
  'Closed': ['Fechado', 'Cerrado'],
  'Now': ['Agora', 'Ahora'],
  'Closed today': ['Fechado hoje', 'Cerrado hoy'],
  'Opens Mon': ['Abre seg', 'Abre lun'],
  'Open now': ['Aberto agora', 'Abierto ahora'],
  'until': ['até', 'hasta'],
  'Gym open': ['Academia aberta', 'Gimnasio abierto'],
  'Group classes': ['Aulas em grupo', 'Clases en grupo'],
  'Address': ['Endereço', 'Dirección'],
  'Phone': ['Telefone', 'Teléfono'],
  // footer + bar
  'Come train with us on Ashton Rd.': ['Venha treinar com a gente na Ashton Rd.', 'Ven a entrenar con nosotros en Ashton Rd.'],
  'Visit': ['Visite', 'Visítanos'],
  'Talk': ['Fale', 'Habla'],
  'Call (267) 338-9078': ['Ligar para (267) 338-9078', 'Llamar al (267) 338-9078'],
  'Directions': ['Como chegar', 'Cómo llegar'],
};
const OK = ['en', 'pt', 'es'];
const SKIP = 'script,style,#goal,#chat,#week,#note,#amt,#today,#mToday,#chart,#word,.lsw';
let L = '';
try { L = localStorage.getItem('sa-lang') || ''; } catch (e) {}
if (!OK.includes(L)) { const n = (navigator.language || '').slice(0, 2).toLowerCase(); L = OK.includes(n) ? n : 'en'; }
const subs = []; let nodes = [], attrs = [];
const t = s => { if (L === 'en') return s; const e = D[s]; return e ? e[L === 'pt' ? 0 : 1] : s; };
function collect() {
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n;
  while ((n = w.nextNode())) { const v = n.nodeValue, k = v.trim(); if (!k || !D[k]) continue; const pe = n.parentElement; if (!pe || pe.closest(SKIP)) continue; nodes.push([n, v, k]); }
  document.querySelectorAll('[alt],[aria-label]').forEach(e => { if (e.closest('.lsw')) return; ['alt', 'aria-label'].forEach(a => { const v = e.getAttribute(a); if (v && D[v]) attrs.push([e, a, v]); }); });
}
function paint() {
  nodes.forEach(([n, v, k]) => { n.nodeValue = v.replace(k, t(k)); });
  attrs.forEach(([e, a, v]) => e.setAttribute(a, t(v)));
  document.documentElement.lang = L === 'pt' ? 'pt-BR' : L;
  document.querySelectorAll('.lsw button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === L)));
}
window.I18N = {
  get l() { return L; }, t,
  on(f) { subs.push(f); },
  set(l) {
    if (l === L || !OK.includes(l)) return; L = l;
    try { localStorage.setItem('sa-lang', l); } catch (e) {}
    paint(); subs.forEach(f => { try { f(L); } catch (e) { console.error(e); } });
    dispatchEvent(new Event('sa-lang'));
  },
  init() { collect(); document.querySelectorAll('.lsw button').forEach(b => b.addEventListener('click', () => I18N.set(b.dataset.lang))); paint(); },
};
})();
