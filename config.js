module.exports = {
    'db': {
        'host': '127.0.0.1',
        'port': '27017',
        'name': 'find-my-car-hapi'
    },
    'api': {
        'host': 'localhost',
        'port': '8000',
        'key': 'RRUix4M9lAbPBr3JmpJ1WGbD3BZiA0m8g11tnJkTQrhJLVe9KEzwMcXPGuVfpXu9'
    },
    'admin': {
        'host': 'localhost',
        'port': '8080'
    },
    'plugins': [
        
        // admin
        { 'name': 'admin', 'label': 'admin' },
        { 'name': 'user', 'label': 'admin' },
        { 'name': 'car', 'label': 'admin' },
        { 'name': 'garage', 'label': 'admin' },
        { 'name': 'price', 'label': 'admin' },
        { 'name': 'spot', 'label': 'admin' },
        { 'name': 'guessedCar', 'label': 'admin' },

        // api
        { 'name': 'login', 'label': 'api' },
        { 'name': 'car', 'label': 'api' },
        { 'name': 'findCar', 'label': 'api' },
    ]
};