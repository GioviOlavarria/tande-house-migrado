    <script>
        document.getElementById('contactForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nombre = document.getElementById('nombre').value;
            const correo = document.getElementById('correo').value;
            const contenido = document.getElementById('contenido').value;
            
            if (nombre && correo && contenido) {
                alert('Mensaje enviado correctamente!\n\nNombre: ' + nombre + '\nCorreo: ' + correo + '\nContenido: ' + contenido);
                
                
                this.reset();
            } else {
                alert('Por favor, completa todos los campos.');
            }
        });
    </script>