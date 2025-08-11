import API_BASE from '../../../config';

export const getProducts = () => async (dispatch) => {
  try {
    const data = await fetch(`${API_BASE}/getproducts`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!data.ok) throw new Error('Failed to fetch products');
    const res = await data.json();
    dispatch({ type: "SUCCESS_GET_PRODUCTS", payload: res });
  } catch (error) {
    dispatch({ type: "FAIL_GET_PRODUCTS", payload: error.message });
  }
};
