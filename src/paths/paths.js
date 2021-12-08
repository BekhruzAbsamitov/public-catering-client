export const paths = {
    login: "auth/login",
    register: "auth/register",
    authToken: 'auth/me',
    photo: "attachment/",

    restaurant: 'restaurant',
    store: 'grocery-store/active',
    allStores: 'grocery-store',
    district: "address/district",
    street: "address/street",
    building: "address/housingBuilding",
    house: "address/houses",

    addReservation: 'reservation',
    getReservation: 'reservation/get-reservation/',
    getReservationByResId: 'reservation/get-reservation-by-res-id/',

    getAvailableTables: 'table/get-available-tables/',

    makeReservation: "reservation/add",

    getRestaurants: 'restaurant',

    getCategories: 'product/product-categories',
    getProducts: 'product/store-id/',
    getActiveProducts: 'product/store-id/active/',
    getProductById: 'product/get/',

    getDistricts: "",
    addRestaurant: "restaurant/add",
    addGroceryStore: "grocery-store/add",

    uploadFile: "attachment/upload-file",
    downloadFile: "attachment/get/",
    changeResActiveStatus: "restaurant/change-active-status/",
    changeStoreActiveStatus: "grocery-store/change-active-status/",

    getTables: "table/restaurant/",
    setTable: "table/add",
    editTable: "table/edit/",

    addProduct: "product/add",
    getTypes: 'product/product-categories',

    makePaymentForReservation: "payment/make-payment-for-reservation",
    makePaymentForOrder: "payment/make-payment-for-order",

    getOrders: "order/by-customer-id",
    saveOrder: 'order/add',
    getOrderItems: 'order/by-order-id/',
    changePaymentStatus: 'order/change-payment-status/',
    editOrder: "order/edit/",
    changeReservationPaymentStatus: 'reservation/confirm-reservation-payment/',
    deleteProduct: 'product/delete/',
    changeExistsStatus: "product/change-exists-status/",
    getPayments: "payment",
    getOrderByStoreId: "order/get-orders-by-store-id/",
    getActiveRestaurants: "restaurant/active",
    getActiveStores: "grocery-store/active"
}