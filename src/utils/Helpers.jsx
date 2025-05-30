export const dateLong = (date) => {
    const dateFormat = new Date(date)
        .toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    
    // First letter capitalize
    return dateFormat.charAt(0).toUpperCase() + dateFormat.slice(1);
}

export const dateShort = (date) => {
    return new Date(date).toLocaleDateString('fr-FR');
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
    
    return dateFormat.charAt(0).toUpperCase() + dateFormat.slice(1);
}


export const firstCapitalize = (word) => {
    // make first letter capitalize
    return word.charAt(0).toUpperCase() + word.slice(1);

}