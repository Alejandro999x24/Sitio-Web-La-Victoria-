/* ============================================
   ASERRADERO LA VICTORIA - LOGICA PRINCIPAL
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    
    // 1. INICIALIZACIÓN
    // ===========================
    // Los iconos Feather se inicializan en el HTML, pero aseguramos
    if (typeof feather !== 'undefined') {
        feather.replace();
    }

    // 2. HEADER EFECTO SCROLL
    // ===========================
    const header = document.querySelector('.header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check inicial

    // 3. MENÚ MÓVIL
    // ===========================
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
            
            // Cambiar icono según estado
            const icon = this.querySelector('svg');
            if (navMenu.classList.contains('active')) {
                this.innerHTML = '<i data-feather="x"></i>';
            } else {
                this.innerHTML = '<i data-feather="menu"></i>';
            }
            if (typeof feather !== 'undefined') feather.replace();
        });

        // Cerrar al hacer click en enlace
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.innerHTML = '<i data-feather="menu"></i>';
                if (typeof feather !== 'undefined') feather.replace();
            });
        });
    }

    // 4. SISTEMA DE FILTRADO (PRODUCTOS)
    // ===========================
    const tabButtons = document.querySelectorAll('.tab-btn');
    const productCards = document.querySelectorAll('.product-card');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remover clase active de todos
            tabButtons.forEach(b => b.classList.remove('active'));
            // Activar botón actual
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            productCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || filterValue === category) {
                    card.style.display = 'block';
                    card.classList.remove('is-filtered-out');
                } else {
                    card.classList.add('is-filtered-out');
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // 5. ANIMACIÓN DE CONTADORES (Intersection Observer)
    // ===========================
    const counters = document.querySelectorAll('.stat-number');
    let hasAnimated = false;

    const animateCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000; // ms
            const increment = target / (duration / 16); // 60fps

            let current = 0;
            const updateCount = () => {
                current += increment;
                if (current < target) {
                    counter.innerText = Math.ceil(current);
                    requestAnimationFrame(updateCount);
                } else {
                    counter.innerText = target + '+';
                }
            };
            updateCount();
        });
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
            animateCounters();
            hasAnimated = true;
        }
    }, { threshold: 0.5 });

    const aboutSection = document.querySelector('.about');
    if (aboutSection) sectionObserver.observe(aboutSection);

    // 6. SCROLL ANIMATIONS (Fade In Up)
    // ===========================
    const scrollElements = document.querySelectorAll('.animate-on-scroll');
    
    const scrollAnimObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.1 });

    scrollElements.forEach(el => scrollAnimObserver.observe(el));

    const faqButtons = document.querySelectorAll('.faq-question');
    if (faqButtons.length) {
        faqButtons.forEach((btn) => {
            btn.addEventListener('click', () => {
                const item = btn.closest('.faq-item');
                if (!item) return;

                const isOpen = item.classList.contains('open');

                faqButtons.forEach((b) => {
                    const it = b.closest('.faq-item');
                    if (!it) return;
                    it.classList.remove('open');
                    b.setAttribute('aria-expanded', 'false');
                });

                if (!isOpen) {
                    item.classList.add('open');
                    btn.setAttribute('aria-expanded', 'true');
                }

                if (typeof feather !== 'undefined') feather.replace();
            });
        });
    }

    // 7. FORMULARIO WHATSAPP
    // ===========================
    const form = document.getElementById('whatsapp-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nombre = document.getElementById('wa-nombre');
            const telefono = document.getElementById('wa-telefono');
            const servicio = document.getElementById('wa-servicio');
            const mensaje = document.getElementById('wa-mensaje');
            const alertBox = document.getElementById('wa-alert');

            // Validación simple
            let isValid = true;
            [nombre, telefono, mensaje].forEach(input => {
                if (!input.value.trim()) {
                    input.classList.add('input-error');
                    isValid = false;
                } else {
                    input.classList.remove('input-error');
                }
            });

            if (!isValid) {
                alertBox.style.display = 'block';
                alertBox.textContent = 'Por favor completa los campos obligatorios.';
                return;
            }

            alertBox.style.display = 'none';

            // Construir Mensaje
            const phoneNumber = '573232429428';
            const textLines = [
                'Bienvenido(a) a Aserradero La Victoria.',
                'Gracias por contactarnos. Para atenderte mejor, compártenos tu pedido:',
                '',
            ];

            const text = encodeURIComponent(textLines.join('\n'));
            window.open(`https://wa.me/${phoneNumber}?text=${text}`, '_blank');
        });

        // Limpiar errores al escribir
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                input.classList.remove('input-error');
                const alertBox = document.getElementById('wa-alert');
                if (alertBox) alertBox.style.display = 'none';
            });
        });
    }

    // 8. GOOGLE MAPS ROUTING
    // ===========================
    window.abrirRuta = function(event) {
        event.preventDefault();
        const btn = event.currentTarget;
        const originalText = btn.innerHTML;
        
        // UI Feedback
        btn.innerHTML = '📍 Localizando...';
        btn.style.pointerEvents = 'none';

        const destinoLat = 5.7339704;
        const destinoLng = -73.085784;

        const openMaps = (lat = null, lng = null) => {
            let url;
            if (lat && lng) {
                url = `https://www.google.com/maps/dir/?api=1&origin=${lat},${lng}&destination=${destinoLat},${destinoLng}&travelmode=driving`;
            } else {
                url = `https://www.google.com/maps/dir/?api=1&destination=${destinoLat},${destinoLng}&travelmode=driving`;
            }
            window.open(url, '_blank');
            
            // Reset UI
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.pointerEvents = 'auto';
                if (typeof feather !== 'undefined') feather.replace();
            }, 1000);
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => openMaps(pos.coords.latitude, pos.coords.longitude),
                () => openMaps() // Error o rechazo -> abre solo destino
            );
        } else {
            openMaps(); // No soporte -> abre solo destino
        }
    };

});
