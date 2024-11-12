import { Textarea as NextUITextarea, TextAreaProps as NextUITextAreaProps } from '@nextui-org/react';
import { FC } from 'react';

// Extend TextAreaProps from Next UI
interface TextAreaProps extends NextUITextAreaProps {
    // Custom prop if needed
}

const Textarea: FC<TextAreaProps> = ({ ...props }) => {
    return (
        <NextUITextarea {...props} />
    );
};

export default Textarea;
