let dateSlice = value => {
    if (!value) return ''
    value = value.toString()
    return value.slice(0, 10)
}

export default { 
    dateSlice,
    toThousands: function(num) {
        return num && num
        .toString()
        .replace(/(^|\s)\d+/g, (m) => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
    }
 }