// Formatear fecha relativa (hace 2 horas, hace 3 días, etc.)
export const formatearFechaRelativa = (fecha) => {
    const ahora = new Date();
    const fechaPublicacion = new Date(fecha);
    const diferenciaMilisegundos = ahora - fechaPublicacion;

    const segundos = Math.floor(diferenciaMilisegundos / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);
    const meses = Math.floor(dias / 30);
    const años = Math.floor(dias / 365);

    if (segundos < 60) return 'Justo ahora';
    if (minutos < 60) return `Hace ${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}`;
    if (horas < 24) return `Hace ${horas} ${horas === 1 ? 'hora' : 'horas'}`;
    if (dias < 30) return `Hace ${dias} ${dias === 1 ? 'día' : 'días'}`;
    if (meses < 12) return `Hace ${meses} ${meses === 1 ? 'mes' : 'meses'}`;
    return `Hace ${años} ${años === 1 ? 'año' : 'años'}`;
};

// Formatear fecha completa (DD/MM/YYYY HH:MM)
export const formatearFechaCompleta = (fecha) => {
    const date = new Date(fecha);
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const año = date.getFullYear();
    const horas = String(date.getHours()).padStart(2, '0');
    const minutos = String(date.getMinutes()).padStart(2, '0');

    return `${dia}/${mes}/${año} ${horas}:${minutos}`;
};