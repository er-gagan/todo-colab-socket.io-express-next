"use client";
import React from 'react'
import { RadioGroup, Radio, cn } from "@nextui-org/react";
import { Accordion, AccordionItem } from "@nextui-org/react";

const UserRoleComponent = ({ required, setUserRole, userRole }: any) => {
    const CustomRadio = (props: any) => {
        const { children, ...otherProps } = props;

        return (
            <Radio
                {...otherProps}
                size='sm'
                classNames={{
                    base: cn(
                        "inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between",
                        "flex-row-reverse max-w-[300px] cursor-pointer rounded-lg gap-4 p-2 border-2 border-transparent",
                        "data-[selected=true]:border-primary min-w-[230px]"
                    ),
                }}
            >
                {children}
            </Radio>
        );
    };
    return (
        <Accordion isCompact variant="bordered">
            <AccordionItem key="1" aria-label="Select Roles" title={<div className='text-[12px] text-default-600'>Select Roles {required ? (<span className='text-red-500'>*</span>) : ''}</div>}>
                <RadioGroup label="" description="" isRequired={required}
                    value={userRole}
                    onValueChange={setUserRole}
                >
                    <div className='flex flex-wrap justify-between items-center'>
                        <CustomRadio description="A user with limited privileges" value="regular-user">
                            Regular User
                        </CustomRadio>

                        <CustomRadio description="A team lead with team privileges" value="teamlead">
                            Team Lead
                        </CustomRadio>

                        <CustomRadio
                            description="An admin with full privileges"
                            value="admin"
                        >
                            Admin
                        </CustomRadio>
                    </div>
                </RadioGroup>
            </AccordionItem>
        </Accordion>
    )
}

export default UserRoleComponent