import { DateTime } from 'luxon'
import slugify from 'slugify'

const route = event => {
    return {
        name: 'event',
        params: {
            date: event._datetime.toISODate(),
            slug: slugify(formatTitle(event), {
                lower: true,
                strict: true,
            }),
        },
    }
}

const formatTitle = event => {
    return event.attributes.title || event.attributes.facebook_title
}

const formatDescription = event => {
    return event.attributes.description || event.attributes.facebook_description
}

const formatPrice = event => {
    const price = event.attributes.price || event.attributes.facebook_price

    if (price === null) {
        return null
    }

    return price.attributes.price.toFixed(2).replace('.', ',')
}

export const formatType = event => {
    return event.attributes.type || event.attributes.facebook_type
}

const formatDate = event => {
    return event._datetime.toFormat('d LLL yyyy')
}

const formatTime = event => {
    return event._datetime.toLocaleString(DateTime.TIME_SIMPLE)
}

const formatWeekday = event => {
    return event._datetime.toFormat('EEEE')
}

const image = event => {
    return `${import.meta.env.VITE_IMAGES_HOST}/${event.attributes.image}`
}

export default {
    route,
    formatTitle,
    formatDescription,
    formatPrice,
    formatType,
    formatDate,
    formatTime,
    formatWeekday,
    image,
}
