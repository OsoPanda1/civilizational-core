
-- RDM Digital: places table
CREATE TABLE public.places (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'cultura',
  description TEXT,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  rating NUMERIC(2,1) DEFAULT 4.5,
  image_url TEXT,
  address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Places are viewable by everyone" ON public.places FOR SELECT USING (true);
CREATE POLICY "Admins can manage places" ON public.places FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RDM Digital: businesses table
CREATE TABLE public.businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  status TEXT DEFAULT 'active',
  phone TEXT,
  hours TEXT,
  image_url TEXT,
  owner_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Businesses are viewable by everyone" ON public.businesses FOR SELECT USING (true);
CREATE POLICY "Owners can manage own businesses" ON public.businesses FOR ALL USING (auth.uid() = owner_id);
CREATE POLICY "Admins can manage all businesses" ON public.businesses FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RDM Digital: events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  location TEXT,
  category TEXT DEFAULT 'cultural',
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Events are viewable by everyone" ON public.events FOR SELECT USING (true);
CREATE POLICY "Admins can manage events" ON public.events FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Seed data: Real del Monte places
INSERT INTO public.places (name, category, description, lat, lng, rating) VALUES
('Mina de Acosta', 'historia', 'Mina histórica del siglo XVIII con recorridos guiados sobre técnicas de extracción y vida obrera.', 20.138, -98.671, 4.8),
('Museo de Medicina Laboral', 'cultura', 'Espacio clave para entender salud ocupacional, riesgos mineros y evolución hospitalaria.', 20.139, -98.673, 4.6),
('Panteón Inglés', 'historia', 'Patrimonio funerario británico con trazos simbólicos de la migración cornish a Hidalgo.', 20.137, -98.67, 4.9),
('Pastes El Portal', 'gastronomia', 'Pastes tradicionales cornish en rango local de $20 a $25 MXN por pieza clásica.', 20.14, -98.672, 4.7),
('Pastes Kikos', 'gastronomia', 'Recetas artesanales con línea tradicional desde 1940.', 20.139, -98.674, 4.5),
('Hotel Real del Monte', 'hospedaje', 'Hospedaje colonial con atmósfera de niebla, ideal para escapadas románticas.', 20.141, -98.675, 4.3),
('Peña del Cuervo', 'aventura', 'Mirador natural para senderismo fotográfico y amaneceres de sierra.', 20.135, -98.668, 4.8),
('Iglesia de la Asunción', 'cultura', 'Templo emblemático del centro histórico, referencia espiritual del pueblo.', 20.14, -98.671, 4.6),
('Centro Cultural Nicolás Zavala', 'cultura', 'Galería y foro para arte local, talleres y actividades comunitarias.', 20.138, -98.672, 4.4),
('Sendero de las Minas', 'aventura', 'Ruta interpretativa entre vestigios mineros, bosque y vistas de alta montaña.', 20.136, -98.669, 4.7),
('Plaza Principal', 'cultura', 'Nodo urbano para eventos, comercio local y vida comunitaria.', 20.1386, -98.6707, 4.5),
('Restaurante La Estación', 'gastronomia', 'Cocina regional con menú de temporada y fogón tradicional.', 20.1377, -98.6715, 4.4),
('Cabaña del Bosque', 'hospedaje', 'Refugio de montaña con vistas al corredor forestal.', 20.1431, -98.6784, 4.6),
('Cascada de la Sierra', 'aventura', 'Ruta eco-aventura con sendero interpretativo y mirador natural.', 20.1324, -98.6642, 4.9);

-- Seed data: businesses
INSERT INTO public.businesses (name, category, description, lat, lng, status) VALUES
('Pastes Mina Real', 'gastronomia', 'Pastes artesanales con receta original cornish.', 20.137, -98.670, 'active'),
('Plata Monte Alto', 'platerias', 'Joyería de plata fina y talleres de diseño.', 20.139, -98.672, 'active'),
('Ruta Cuatrimoto Eclipse', 'servicios-turisticos', 'Tours en cuatrimoto por la sierra.', 20.141, -98.675, 'active'),
('Casa Cabaña del Bosque', 'hospedaje', 'Alojamiento rústico con chimenea.', 20.136, -98.667, 'active'),
('Mercería La Montaña', 'artesanias', 'Textiles y artesanías locales.', 20.132, -98.669, 'active'),
('Café La Mina', 'gastronomia', 'Café de altura con repostería artesanal.', 20.1385, -98.6710, 'active');

-- Seed data: events
INSERT INTO public.events (title, description, event_date, location, category, is_featured) VALUES
('Festival del Paste', 'Celebración anual del paste cornish con concursos y degustaciones.', '2026-10-10', 'Plaza Principal', 'gastronomia', true),
('Día de Muertos en Real del Monte', 'Tradición viva con altares, cempasúchil y recorridos nocturnos.', '2026-11-01', 'Panteón Inglés', 'cultural', true),
('Feria de la Plata', 'Exposición y venta de joyería de plata de artesanos locales.', '2026-08-15', 'Centro Cultural', 'artesanias', false),
('Senderismo Nocturno', 'Caminata guiada por senderos históricos bajo las estrellas.', '2026-04-20', 'Sendero de las Minas', 'aventura', false),
('Concierto en la Sierra', 'Música en vivo con artistas regionales y nacionales.', '2026-07-12', 'Peña del Cuervo', 'cultural', true);
