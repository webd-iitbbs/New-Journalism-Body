import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

const Spinner = ({ size }) => (
    <Spin indicator={<LoadingOutlined spin />} size={size} />
);

export default Spinner;