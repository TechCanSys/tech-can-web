create type public.app_role as enum ('admin', 'user');
create table public.user_roles (id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete cascade not null, role app_role not null, unique (user_id, role));
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create or replace function public.has_role(_user_id uuid, _role app_role) returns boolean language sql stable security definer set search_path = public as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;
create policy "Users read own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());

create or replace function public.assign_first_admin() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  end if;
  return new;
end $$;
create trigger on_auth_user_created_admin after insert on auth.users for each row execute function public.assign_first_admin();

create or replace function public.admin_exists() returns boolean language sql stable security definer set search_path = public as $$ select exists (select 1 from public.user_roles where role = 'admin') $$;
grant execute on function public.admin_exists() to anon, authenticated;

create or replace function public.touch_updated_at() returns trigger language plpgsql set search_path = public as $$ begin new.updated_at = now(); return new; end $$;

create table public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null, title_en text not null default '',
  short text not null default '', short_en text not null default '',
  category text not null default 'Operações',
  icon text not null default 'Wrench',
  image_url text,
  items text[] not null default '{}', items_en text[] not null default '{}',
  position int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
grant select on public.services to anon, authenticated;
grant insert, update, delete on public.services to authenticated;
grant all on public.services to service_role;
alter table public.services enable row level security;
create policy "Public reads published services" on public.services for select to anon, authenticated using (published or public.has_role(auth.uid(), 'admin'));
create policy "Admins manage services" on public.services for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create trigger services_touch before update on public.services for each row execute function public.touch_updated_at();

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  tag text not null default '', tag_en text not null default '',
  title text not null, title_en text not null default '',
  description text not null default '', description_en text not null default '',
  image_url text,
  position int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
grant select on public.projects to anon, authenticated;
grant insert, update, delete on public.projects to authenticated;
grant all on public.projects to service_role;
alter table public.projects enable row level security;
create policy "Public reads published projects" on public.projects for select to anon, authenticated using (published or public.has_role(auth.uid(), 'admin'));
create policy "Admins manage projects" on public.projects for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create trigger projects_touch before update on public.projects for each row execute function public.touch_updated_at();

create table public.site_content (
  key text primary key,
  value_pt text not null default '',
  value_en text not null default '',
  updated_at timestamptz not null default now()
);
grant select on public.site_content to anon, authenticated;
grant insert, update, delete on public.site_content to authenticated;
grant all on public.site_content to service_role;
alter table public.site_content enable row level security;
create policy "Public reads site content" on public.site_content for select to anon, authenticated using (true);
create policy "Admins manage site content" on public.site_content for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create trigger site_content_touch before update on public.site_content for each row execute function public.touch_updated_at();

create table public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 255),
  phone text not null default '' check (char_length(phone) <= 40),
  company text not null default '' check (char_length(company) <= 160),
  service text not null default '' check (char_length(service) <= 200),
  message text not null default '' check (char_length(message) <= 3000),
  status text not null default 'novo' check (status in ('novo','em_andamento','concluido','arquivado')),
  notes text not null default '',
  created_at timestamptz not null default now()
);
grant insert on public.quote_requests to anon, authenticated;
grant select, update, delete on public.quote_requests to authenticated;
grant all on public.quote_requests to service_role;
alter table public.quote_requests enable row level security;
create policy "Anyone can send a quote request" on public.quote_requests for insert to anon, authenticated with check (status = 'novo' and notes = '');
create policy "Admins read quote requests" on public.quote_requests for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins update quote requests" on public.quote_requests for update to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins delete quote requests" on public.quote_requests for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

create policy "Public reads site images" on storage.objects for select using (bucket_id = 'site-images');
create policy "Admins upload site images" on storage.objects for insert to authenticated with check (bucket_id = 'site-images' and public.has_role(auth.uid(), 'admin'));
create policy "Admins update site images" on storage.objects for update to authenticated using (bucket_id = 'site-images' and public.has_role(auth.uid(), 'admin'));
create policy "Admins delete site images" on storage.objects for delete to authenticated using (bucket_id = 'site-images' and public.has_role(auth.uid(), 'admin'));

insert into public.site_content (key, value_pt, value_en) values
('hero_eyebrow', 'Tecnologia com propósito', 'Technology with purpose'),
('hero_tagline', 'Inovando o futuro da tecnologia.', 'Innovating the future of technology.'),
('hero_desc', 'Transformamos desafios em soluções. Da infraestrutura à inovação digital, conectamos o seu negócio a novas possibilidades.', 'We turn challenges into solutions. From infrastructure to digital innovation, we connect your business to new possibilities.'),
('contact_phone', '+258 852637473', '+258 852637473'),
('contact_phone2', '+258 878088000', '+258 878088000'),
('contact_email', 'geral@techcansystems.site', 'geral@techcansystems.site'),
('contact_whatsapp', '258852637473', '258852637473');

insert into public.services (slug, title, title_en, short, short_en, category, icon, items, items_en, position) values
('consultoria', 'Consultoria & suporte técnico', 'Consulting & technical support', 'Menos interrupções. Mais produtividade. Cuidamos da sua tecnologia para que se concentre no seu negócio.', 'Fewer interruptions, more productivity. We look after your technology so you can focus on your business.', 'Operações', 'Wrench', array['Consultoria, auditoria de TI e transformação digital', 'Suporte remoto, presencial e atendimento emergencial', 'Manutenção preventiva e corretiva de computadores e servidores', 'Diagnóstico, reparação, substituição de peças e atualização de software'], array['IT consulting, auditing and digital transformation', 'Remote and on-site support, plus emergency assistance', 'Preventive and corrective maintenance for computers and servers', 'Diagnostics, repairs, part replacement and software updates'], 1),
('digital', 'Desenvolvimento & presença digital', 'Web & digital presence', 'Transforme a sua presença online numa oportunidade de crescimento, com experiências que aproximam clientes da sua marca.', 'Turn your online presence into a growth opportunity, with experiences that bring customers closer to your brand.', 'Digital', 'Code2', array['Sites institucionais, blogs, lojas online e aplicações Android e iOS', 'Registo de domínios, alojamento e monitorização de sites', 'Marketing digital, redes sociais e criação de conteúdo', 'SEO e campanhas Google Ads e Meta Ads'], array['Institutional websites, blogs, online stores and Android & iOS apps', 'Domain registration, hosting and website monitoring', 'Digital marketing, social media and content creation', 'SEO and Google Ads & Meta Ads campaigns'], 2),
('infraestrutura', 'Infraestrutura & cloud', 'Infrastructure & cloud', 'Uma base sólida para crescer. Redes estáveis, servidores eficientes e dados disponíveis quando mais precisa.', 'A solid foundation to grow: stable networks, efficient servers and data available whenever you need it.', 'Operações', 'Network', array['Cabeamento estruturado, Wi-Fi, routers e switches', 'Instalação e gestão de servidores físicos e virtuais Linux e Windows', 'Backup automatizado, recuperação de dados e gestão de acessos', 'Migração e armazenamento em cloud: Google Drive, OneDrive, Dropbox e cloud privada'], array['Structured cabling, Wi-Fi, routers and switches', 'Installation and management of physical and virtual Linux and Windows servers', 'Automated backup, data recovery and access management', 'Cloud migration and storage: Google Drive, OneDrive, Dropbox and private cloud'], 3),
('seguranca', 'Segurança integrada', 'Integrated security', 'Proteja o que importa: os seus espaços, as suas pessoas e a informação que faz o seu negócio funcionar.', 'Protect what matters: your spaces, your people and the information that keeps your business running.', 'Segurança', 'ShieldCheck', array['Venda e instalação de câmaras IP, analógicas e CFTV', 'Monitorização remota e integração com alarmes', 'Controlo de acesso e sistemas de controlo de ponto', 'Firewalls, antivírus, auditoria de vulnerabilidades e políticas de segurança', 'Prevenção de phishing, ransomware e ataques DDoS'], array['Sale and installation of IP cameras, analog cameras and CCTV', 'Remote monitoring and alarm integration', 'Access control and time-and-attendance systems', 'Firewalls, antivirus, vulnerability audits and security policies', 'Protection against phishing, ransomware and DDoS attacks'], 4),
('empresarial', 'Soluções empresariais & equipamentos', 'Business solutions & equipment', 'Conecte processos, simplifique a gestão e equipe a sua empresa com soluções ajustadas à sua realidade.', 'Connect processes, simplify management and equip your company with solutions tailored to your reality.', 'Operações', 'Workflow', array['Implementação e integração de ERP, CRM e software personalizado', 'Automação comercial, POS e terminais de pagamento', 'E-commerce com eMola, M-Pesa e mKesh, APIs e chatbots', 'Computadores, servidores, periféricos e montagem de PCs personalizados', 'Licenciamento e configuração de software, e-mail e sistemas operacionais', 'Impressoras, toners, cartuchos e outsourcing de impressão'], array['Implementation and integration of ERP, CRM and custom software', 'Commercial automation, POS systems and payment terminals', 'E-commerce with eMola, M-Pesa and mKesh, APIs and chatbots', 'Computers, servers, peripherals and custom PC builds', 'Software licensing and configuration, email and operating systems', 'Printers, toners, cartridges and print outsourcing'], 5),
('formacao', 'Formação & capacitação', 'Training & capacity building', 'Tecnologia nas mãos de quem sabe usá-la. Desenvolva competências práticas para trabalhar melhor e ir mais longe.', 'Technology in the hands of those who know how to use it. Develop practical skills to work better and go further.', 'Formação', 'GraduationCap', array['Informática básica e avançada, Office e boas práticas digitais', 'Manutenção de computadores, redes e introdução à programação', 'Formação corporativa em software, proteção de dados e cibersegurança', 'Marketing digital, e-commerce, dropshipping, anúncios e análise de métricas'], array['Basic and advanced IT, Office and digital best practices', 'Computer and network maintenance and an introduction to programming', 'Corporate training in software, data protection and cybersecurity', 'Digital marketing, e-commerce, dropshipping, ads and metrics analysis'], 6);

insert into public.projects (slug, tag, tag_en, title, title_en, description, description_en, position) values
('erp', 'ERP', 'ERP', 'Gestão comercial para lojas', 'Retail sales management', 'Sistema de stock, vendas e relatórios integrado com terminais de pagamento.', 'Stock, sales and reporting system integrated with payment terminals.', 1),
('ecommerce', 'E-commerce', 'E-commerce', 'Loja online com M-Pesa', 'Online store with M-Pesa', 'Loja virtual com pagamentos por M-Pesa, eMola e mKesh e gestão simples de encomendas.', 'Online store with M-Pesa, eMola and mKesh payments and simple order management.', 2),
('rede', 'Redes', 'Networks', 'Rede e servidores de escritório', 'Office network and servers', 'Cabeamento estruturado, Wi-Fi e servidor de ficheiros com acessos controlados.', 'Structured cabling, Wi-Fi and a file server with controlled access.', 3),
('cftv', 'Segurança', 'Security', 'Monitorização CFTV remota', 'Remote CCTV monitoring', 'Câmaras IP com acesso às imagens pelo telemóvel, em qualquer lugar.', 'IP cameras with mobile access to live footage, from anywhere.', 4),
('formacao', 'Formação', 'Training', 'Capacitação em informática', 'IT skills training', 'Formação prática em Office e segurança digital para equipas empresariais.', 'Hands-on Office and digital security training for business teams.', 5),
('suporte', 'Suporte', 'Support', 'Suporte gerido para PME', 'Managed support for SMEs', 'Manutenção preventiva e apoio técnico mensal para equipamentos do escritório.', 'Preventive maintenance and monthly technical support for office equipment.', 6);