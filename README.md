# Proyecto

Este proyecto fue generado con [Angular CLI](https://github.com/angular/angular-cli) version 15.2.1.

El proyecto consta de una pagina web que muestra casas de Minecraft, estilo AirBnV, donde el usuario puede rentar una de estas casas.
Consta de una pagina de registro donde hay un formulario que se valida usando el framework de Angular, una vez registrado, dichos registros se
van a una base de datos en FireBase.

De igual manera, se hace uso de NodeJS, para generar todas las dependecias que se requieren. Para descargar las dependencias necesarias, solo hace
falta ingresar a la terminal dentro de la carpeta del proyecto y escribir `npm install`.

Entre las funcionalidades que esta pagina tiene, una de ellas es la posibilidad de hacerla una pagina PWA, es decir, desde el dispositivo movil, se puede descargar
como si fuera una aplicacion nativa. A su vez, tambien se agrego el uso de codigos QR que redirijen al usuario a una pagina en especifico, asi como
atajos de accesibilidad, lo que le da a la pagina un nivel de inclusion mayor.

## Levantar un servidor en el localhost

Usa `ng serve` para un servidor de desarrollo. Dirigirse a `http://localhost:4200/`. la aplicacion se actualizara automaticamente al realizar cambios en el codgo fuente.


## Construir el proyecto

Usa `ng build` para construir el proyecto. Todos los archivos correspondientes se guardaran en la carpeta `dist/`.
