
export const getDayName = (dayIndex) => {
    const days = ['კვირა', 'ორშაბათი', 'სამშაბათი', 'ოთხშაბათი', 'ხუთშაბათი', 'პარასკევი', 'შაბათი'];
    return days[dayIndex];
}

export const getFormatedDateWithYear = (date) => {
    const components = date.toISOString().substring(0, 10).split("-");
    return components[2] + "." + components[1] + "." + components[0]
}

export const getFormatedDate = (date) => {
    const components = date.toISOString().substring(0, 10).split("-");
    return components[2] + "." + components[1] + "." + components[0]
}

export const getFormatedTime = (date) => {
    return date.toISOString().substring(11, 16);
}