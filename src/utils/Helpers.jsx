export const firstCapitalize = (word) => {
    // make first letter capitalize
    return word.charAt(0).toUpperCase() + word.slice(1);
}

export const dateLong = (date) => {
    const dateFormat = new Date(date)
        .toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

    // format day number month year
    return firstCapitalize(dateFormat);
}

export const dateFull = (date) => {
    const dateFormat = new Date(date)
        .toLocaleString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    
    // format day number month year time
    return firstCapitalize(dateFormat);
}

export const dateShort = (date) => {
    //format dd/mm/yyyy
    return new Date(date).toLocaleDateString('fr-FR');
}

export const dateShortTime = (date) => {

    const dateTime = new Date(date);

    //format dd/mm/yyyy
    const dateShort = dateTime.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric'
    });

    //format time 00:00
    const time = dateTime.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
    });

    //format dd/mm/yyyy à hh/mm
    return `${dateShort} à ${time}`;
}

export const dateMonthYear = (date) => {
    const dateFormat = new Date(date)
        .toLocaleDateString('fr-FR', {
            month: 'long',
            year: 'numeric'
        });
    
    return firstCapitalize(dateFormat);
}

export const dateMessageFormat = (date) => {

    const messageDate = new Date(date);
    const currentDate = new Date();
    
    // difference in milliseconds
    const diffMs = currentDate - messageDate;
    
    // convert into minute
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    // if less than 1h (60mmin)
    if (diffMinutes < 60) {
        // if less than 1 minute, show "il y a 1 min"
        const minutes = diffMinutes < 1 ? 1 : diffMinutes;
        return `il y a ${minutes} min`;
    }
    
    // if datetime is more than 1 hour -> format dd/mm à 00:00
    const dayMonth = messageDate.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit'
    });
    
    const time = messageDate.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    return `${dayMonth} à ${time}`;
}