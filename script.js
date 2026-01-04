// Smooth scroll para el indicador de scroll
document.addEventListener('DOMContentLoaded', function() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth'
            });
        });
    }
    
    // Countdown Timer - 29 de marzo de 2026 a las 5:00 PM (UTC-6)
    // Crear la fecha objetivo en UTC-6 (zona horaria de México/Centroamérica)
    const weddingDate = new Date('2026-03-29T17:00:00-06:00');
    
    function updateCountdown() {
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        
        // Verificar que los elementos existan
        if (!daysEl || !hoursEl || !minutesEl || !secondsEl) {
            console.log('Elementos del contador no encontrados');
            return;
        }
        
        // Obtener la hora actual en UTC para comparar correctamente
        const now = new Date();
        const distance = weddingDate.getTime() - now.getTime();
        
        if (distance < 0) {
            // Si la fecha ya pasó
            daysEl.textContent = '0';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Actualizar los elementos del DOM
        daysEl.textContent = days;
        hoursEl.textContent = hours.toString().padStart(2, '0');
        minutesEl.textContent = minutes.toString().padStart(2, '0');
        secondsEl.textContent = seconds.toString().padStart(2, '0');
    }
    
    // Actualizar el contador inmediatamente y luego cada segundo
    updateCountdown();
    setInterval(updateCountdown, 1000);
    
    // Animación de entrada para elementos al hacer scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar elementos para animación
    const animatedElements = document.querySelectorAll('.detail-card, .gallery-item, .story-text, .countdown-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Manejo del formulario RSVP
    const rsvpForm = document.getElementById('rsvpForm');
    const rsvpSuccess = document.getElementById('rsvpSuccess');
    
    // IMPORTANTE: Reemplaza esta URL con la URL de tu aplicación web de Google Apps Script
    // Obtén la URL siguiendo las instrucciones en GOOGLE_SHEETS_SETUP.md
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzMCdxt6JcEzEAXCtolxzlG8X0gdPy9_c7flZjFYK1tbom0kXurHUqDBbLzcEsPZI7J3g/exec';
    
    if (rsvpForm) {
        // Manejar los botones de respuesta (Sí/No)
        const responseButtons = rsvpForm.querySelectorAll('.response-btn');
        const responseInput = document.getElementById('response');
        
        responseButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remover clase active de todos los botones
                responseButtons.forEach(btn => btn.classList.remove('active'));
                // Agregar clase active al botón clickeado
                this.classList.add('active');
                // Actualizar el valor del input hidden
                responseInput.value = this.getAttribute('data-response');
            });
        });
        
        rsvpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const firstNameInput = document.getElementById('firstName');
            const lastNameInput = document.getElementById('lastName');
            const firstNameValue = firstNameInput.value.trim();
            const lastNameValue = lastNameInput.value.trim();
            
            // Validar que el nombre no esté vacío
            if (!firstNameValue) {
                firstNameInput.focus();
                firstNameInput.classList.add('error');
                setTimeout(() => {
                    firstNameInput.classList.remove('error');
                }, 3000);
                alert('Por favor, ingresa tu nombre antes de enviar la respuesta.');
                return;
            }
            
            // Validar que el apellido no esté vacío
            if (!lastNameValue) {
                lastNameInput.focus();
                lastNameInput.classList.add('error');
                setTimeout(() => {
                    lastNameInput.classList.remove('error');
                }, 3000);
                alert('Por favor, ingresa tu apellido antes de enviar la respuesta.');
                return;
            }
            
            // Remover clases de error si existen
            firstNameInput.classList.remove('error');
            lastNameInput.classList.remove('error');
            
            // Validar que se haya seleccionado una respuesta
            if (!responseInput.value) {
                alert('Por favor, selecciona si asistirás o no a la boda.');
                return;
            }
            
            // Deshabilitar el botón mientras se envía
            const submitButton = rsvpForm.querySelector('.btn-submit');
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';
            
            // Obtener valores del formulario
            const formData = {
                firstName: firstNameValue,
                lastName: lastNameValue,
                response: responseInput.value,
                message: document.getElementById('message').value.trim()
            };
            
            // Verificar si la URL está configurada
            if (GOOGLE_SCRIPT_URL === 'TU_URL_DE_GOOGLE_APPS_SCRIPT_AQUI') {
                console.warn('Google Script URL no configurada. Los datos no se enviarán.');
                // Mostrar mensaje de éxito de todas formas (modo demo)
                rsvpForm.style.display = 'none';
                rsvpSuccess.style.display = 'block';
                return;
            }
            
            // Enviar datos a Google Sheets
            fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            .then(() => {
                // Con mode: 'no-cors' no podemos ver la respuesta, pero asumimos éxito
                rsvpForm.style.display = 'none';
                rsvpSuccess.style.display = 'block';
                rsvpForm.reset();
                // Limpiar selección de botones
                responseButtons.forEach(btn => btn.classList.remove('active'));
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Hubo un error al enviar tu confirmación. Por favor, intenta de nuevo.');
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            });
        });
    }
    
    // Efecto parallax suave en el hero
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        const hero = document.querySelector('.hero-content');
        
        if (hero && currentScroll < window.innerHeight) {
            const parallaxValue = currentScroll * 0.5;
            hero.style.transform = `translateY(${parallaxValue}px)`;
            hero.style.opacity = 1 - (currentScroll / window.innerHeight) * 0.5;
        }
        
        lastScroll = currentScroll;
    });
    
    // Ocultar scroll indicator cuando se hace scroll
    window.addEventListener('scroll', function() {
        if (scrollIndicator) {
            if (window.pageYOffset > 100) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.transition = 'opacity 0.3s ease';
            } else {
                scrollIndicator.style.opacity = '1';
            }
        }
    });
});

/*Funcion para reproducir el audio al dar click en el boton*/
/*
const audio = document.getElementById("audioFondo");
const btn = document.getElementById("audioBtn");

btn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    audio.volume = 0.05; // volumen de fondo
    btn.textContent = "⏸️";
  } else {
    audio.pause();
    btn.textContent = "▶️";
  }
});
*/

const audio = document.getElementById("audioFondo");
let yaReproducido = false;

window.addEventListener("scroll", () => {
if (!yaReproducido) {
    audio.play().then(() => {
    yaReproducido = true;
    }).catch(err => {
    console.log("El navegador bloqueó el audio:", err);
    });
}
});

