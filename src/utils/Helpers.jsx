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
    
    return firstCapitalize(dateFormat);
}

export const dateShort = (date) => {
    //format dd/mm/yyyy
    return new Date(date).toLocaleDateString('fr-FR');
}

export const dateMonthYear = (date) => {
    const dateFormat = new Date(date)
        .toLocaleDateString('fr-FR', {
            month: 'long',
            year: 'numeric'
        });
    
    return firstCapitalize(dateFormat);
}