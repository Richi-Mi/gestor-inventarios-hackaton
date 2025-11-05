import { useEffect, useState } from 'react';

export const useForm = ( initialForm = {} ) : any => {
  
    const [ formState, setFormState ] = useState( initialForm );

    useEffect( () => {
        setFormState( initialForm )
    }, [ initialForm ] )

    const onInputChange = ({ target }: any) => {
        const { name, value } = target;
        setFormState({
            ...formState,
            [ name ]: value
        });
    }

    const onResetForm = () => {
        setFormState( initialForm );
    }


    return {
        ...formState,

        formState,
        onInputChange,
        onResetForm,

    }
}