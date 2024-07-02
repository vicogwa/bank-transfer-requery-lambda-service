const {
    INFOBIPS_API_KEY,
    BROADBASED_API_KEY,
    INFOBIPS_BASEURL,
    BROADBASED_BASEURL,
    BROADBASED_SENDER_ID,
    BROADBASED_EMAIL,
    BROADBASED_MSG_TYPE,
    BROADBASED_INPUT_MODE,
    WALLET_HMAC_KEY,
} = process.env;

export default {
    infobips_api_key: INFOBIPS_API_KEY,
    broadbased_api_key: BROADBASED_API_KEY,
    infobips_baseurl: INFOBIPS_BASEURL,
    broadbased_baseurl: BROADBASED_BASEURL,
    broadbased_email: BROADBASED_EMAIL,
    broadbased_sender_id: BROADBASED_SENDER_ID,
    broadbased_msg_type: BROADBASED_MSG_TYPE,
    broadbased_input_mode: BROADBASED_INPUT_MODE,
    wallet_hmac_key: WALLET_HMAC_KEY,
};
