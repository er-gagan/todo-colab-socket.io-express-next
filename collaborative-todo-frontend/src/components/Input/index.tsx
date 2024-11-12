import { Input as NextUIInput, InputProps as NextUIInputProps } from '@nextui-org/react';
import { FC } from 'react';

// Extend InputProps from Next UI
interface InputProps extends NextUIInputProps {
    // 
}

const Input: FC<InputProps> = ({ ...props }) => {
    return (

        <NextUIInput
            {...props}

        />

    );
};

export default Input;
