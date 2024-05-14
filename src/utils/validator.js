import * as yup from 'yup';

export const userValidator = yup.object().shape({
    fullname:yup.string().required().test("len","fullname must be at least 3 characters",(val)=>val.length>=3),
    username:yup.string().required().test("len","username must be at least 3 characters",(val)=>val.length>=3),
    password:yup.string().required().test("len","password must be at least 3 characters",(val)=>val.length>=3),
})
export const groupValidator = yup.object().shape({
    name:yup.string().required().length("name must be at least 3 characters")
})
