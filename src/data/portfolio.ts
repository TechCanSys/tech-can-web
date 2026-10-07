import coverBusiness from '@/assets/service-business.jpg'
import coverDigital from '@/assets/service-digital.jpg'
import coverNetwork from '@/assets/service-network.jpg'
import coverSecurity from '@/assets/service-security.jpg'
import coverTraining from '@/assets/service-training.jpg'
import coverSupport from '@/assets/service-support.jpg'

export const projects = [
  { id: 'erp', tag: 'ERP', tagEn: 'ERP', image: coverBusiness, title: 'Gestão comercial para lojas', titleEn: 'Retail sales management', desc: 'Sistema de stock, vendas e relatórios integrado com terminais de pagamento.', descEn: 'Stock, sales and reporting system integrated with payment terminals.' },
  { id: 'ecommerce', tag: 'E-commerce', tagEn: 'E-commerce', image: coverDigital, title: 'Loja online com M-Pesa', titleEn: 'Online store with M-Pesa', desc: 'Loja virtual com pagamentos por M-Pesa, eMola e mKesh e gestão simples de encomendas.', descEn: 'Online store with M-Pesa, eMola and mKesh payments and simple order management.' },
  { id: 'rede', tag: 'Redes', tagEn: 'Networks', image: coverNetwork, title: 'Rede e servidores de escritório', titleEn: 'Office network and servers', desc: 'Cabeamento estruturado, Wi-Fi e servidor de ficheiros com acessos controlados.', descEn: 'Structured cabling, Wi-Fi and a file server with controlled access.' },
  { id: 'cftv', tag: 'Segurança', tagEn: 'Security', image: coverSecurity, title: 'Monitorização CFTV remota', titleEn: 'Remote CCTV monitoring', desc: 'Câmaras IP com acesso às imagens pelo telemóvel, em qualquer lugar.', descEn: 'IP cameras with mobile access to live footage, from anywhere.' },
  { id: 'formacao', tag: 'Formação', tagEn: 'Training', image: coverTraining, title: 'Capacitação em informática', titleEn: 'IT skills training', desc: 'Formação prática em Office e segurança digital para equipas empresariais.', descEn: 'Hands-on Office and digital security training for business teams.' },
  { id: 'suporte', tag: 'Suporte', tagEn: 'Support', image: coverSupport, title: 'Suporte gerido para PME', titleEn: 'Managed support for SMEs', desc: 'Manutenção preventiva e apoio técnico mensal para equipamentos do escritório.', descEn: 'Preventive maintenance and monthly technical support for office equipment.' },
]

export const testimonials = [
  { id: 't1', name: 'Ana Machava', role: 'Gestora de loja, Maputo', roleEn: 'Store manager, Maputo', quote: 'A Tech-Can instalou o nosso sistema de vendas e formou a equipa em poucos dias. O atendimento ficou mais rápido e sem erros.', quoteEn: 'Tech-Can set up our sales system and trained the team in just a few days. Service is now faster and error-free.' },
  { id: 't2', name: 'Carlos Tembe', role: 'Diretor administrativo, Matola', roleEn: 'Administrative director, Matola', quote: 'Resolvem os problemas de rede e servidores com rapidez. Hoje temos backups automáticos e mais segurança.', quoteEn: 'They solve our network and server issues quickly. We now have automatic backups and better security.' },
  { id: 't3', name: 'Sofia Nhaca', role: 'Fundadora de startup, Beira', roleEn: 'Startup founder, Beira', quote: 'Criaram o site e as campanhas digitais da nossa marca. Em pouco tempo começámos a receber pedidos pelo WhatsApp.', quoteEn: "They built our brand's website and digital campaigns. Within a short time we started receiving orders on WhatsApp." },
]
