import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Modal, Space } from 'antd';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';

const ConfirmDelete = ({id, url, title}) =>
    Modal.confirm({
      title,
      // content: "first",
      onOk: async () => {
        try {
          console.log("item id", id);
          console.log("Clicked confirm");
          const requestUrl = `${url}/${id}`;
          await axios.patch(requestUrl).then((res) => {
            if (res?.data?.status == "success") {
              toast.success("Cập nhật thành công", {
                position: "bottom-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            }
          });
        } catch (error) {
          Modal.error({
            title: "error",
            content: error.message,
          });
        }
      },
    });