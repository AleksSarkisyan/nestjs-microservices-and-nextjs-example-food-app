export enum Messages {
    TOKEN_ERROR = 'Could not get token',
    LOGIN_ERROR = 'Could not log in',
    TOKEN_VALIDATION_ERROR = 'Token validation failed',
    USER_EXIST_ERROR = 'User already exists',
    USER_NOT_FOUND = 'User not found',
    NO_PRODUCTS_FOUND = 'No products found',
    CREATE_PRODUCT_ERROR = 'Creating product failed',
    CREATE_STRIPE_PRODUCT_ERROR = 'Creating stripe product failed',
    CREATE_PRODUCT_PRICE_ERROR = 'Creating product price failed',
    CREATE_PRICE_ERROR = 'Creating price failed',
    UPDATE_PRODUCT_ERROR = 'Updating product failed',
    STRIPE_ID_ERROR = 'Missing stripeId',
    FIND_STRIPE_PRODUCT_ERROR = 'Could not find stripe product',
    STRIPE_PRICE_ID_ERROR = 'Missing stripePriceId',
    STRIPE_PRICE_ERROR = 'Could not find stripe price',
    STRIPE_ARCHIVE_ERROR = 'Could not archive stripe price',
    CREATE_ORDER_ERROR = 'Could not create order',
    CREATE_ORDER_DETAILS_ERROR = 'Could not create order details',
    FIND_RESTAURANT_ERROR = 'Could not find restaurant'
}