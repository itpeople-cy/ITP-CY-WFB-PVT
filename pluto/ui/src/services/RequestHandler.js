import React from 'react';
import { toast } from 'react-toastify';

function successHandler(mesg) {
  toast.success((<div className="text-center">{mesg}</div>), {
    pauseOnHover: false,
    autoClose: 3000,
  });
  return mesg;
}

function errorHandler(error) {
  switch (error.response.status) {
    case 400:
        if (error.response.data) {
          toast.error((<div className="text-center">{error.response.data.message}</div>), {
            pauseOnHover: false,
            autoClose: 3000,
          });
        }
        break;
    case 401:
        if (error.response.data) {
          toast.error((<div className="text-center">{error.response.data.message}</div>), {
            pauseOnHover: false,
            autoClose: 3000,
          });
        }
        break;
    case 403:
        if (error.response.data) {
          toast.error((<div className="text-center">{error.response.data.message}</div>), {
            pauseOnHover: false,
            autoClose: 3000,
          });
        }
        break;
    case 404:
        if (error.response.data) {
          toast.error((<div className="text-center">{error.response.data.message}</div>), {
            pauseOnHover: false,
            autoClose: 3000,
          });
        }
        break;
    case 500:
      if (error.response.data) {
        toast.error((<div className="text-center">{error.response.data.message}</div>), {
          pauseOnHover: false,
          autoClose: 3000,
        });
      }
      break;
     // throw new Error(error.response.data);
    default:
      break;
  }
}

export { errorHandler, successHandler };
