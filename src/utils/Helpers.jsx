// make first letter capitalize
export const firstCapitalize = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

// format Vendredi 4 juillet 2025
export const dateLong = (date) => {
    const dateFormat = new Date(date)
        .toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    return firstCapitalize(dateFormat);
}

// format Vendredi 4 juillet 2025 à 20:21
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
    return firstCapitalize(dateFormat);
}

//format 04/07/2025
export const dateShort = (date) => {
    return new Date(date).toLocaleDateString('fr-FR');
}

//format 04/07/2025 à 20:21
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
    return `${dateShort} à ${time}`;
}

// format : 4 juillet 2025 à 20:24
export const dateLongTime = (date) => {
    const dateTime = new Date(date);

    // jj/mm/aa
    const dateLong = dateTime.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    // hh:mmm
    const time = dateTime.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
    });

    return `${firstCapitalize(dateLong)} à ${time}`;
}

//format Juillet 2025
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