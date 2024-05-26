import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};
export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const response = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await response.json();
    // console.log(response, data);
    if (!response.ok) throw new Error(`${data.message} (${response.status})`);
    return data;
  } catch (err) {
    //// throwing the error so that it can be caught on the other importing async function
    throw err;
  }
};
/*export const getJSON = async function (url) {
  try {
    // const response = await fetch(
    //   'https://forkify-api.herokuapp.com/api/v2/recipes/664c8f193e7aa067e94e8438'
    // );

    const fetchPro = fetch(url);
    const response = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await response.json();
    // console.log(response, data);
    if (!response.ok) throw new Error(`${data.message} (${response.status})`);
    return data;
  } catch (err) {
    //// throwing the error so that it can be caught on the other importing async function
    throw err;
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    // const response = await fetch(
    //   'https://forkify-api.herokuapp.com/api/v2/recipes/664c8f193e7aa067e94e8438'
    // );

    const fetchPro = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });
    const response = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await response.json();
    // console.log(response, data);
    if (!response.ok) throw new Error(`${data.message} (${response.status})`);
    return data;
  } catch (err) {
    //// throwing the error so that it can be caught on the other importing async function
    throw err;
  }
};
*/
