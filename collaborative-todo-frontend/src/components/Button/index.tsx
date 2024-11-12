"use client";
import { Button as NextUIButton, ButtonProps as NextUIButtonProps } from '@nextui-org/react';
import { FC, useMemo } from 'react';

interface ButtonProps extends NextUIButtonProps {
    label: string | React.ReactNode;
}

const Button: FC<ButtonProps> = (props) => {

    const {
        label = "Submit",
    } = props

    return (
        <NextUIButton {...props}>
            {label}
        </NextUIButton>
    );
};

export default Button;