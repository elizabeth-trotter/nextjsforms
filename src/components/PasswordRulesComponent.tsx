import React from 'react'

const PasswordRulesComponent = (props: { correct: boolean, error: boolean, rule: string }) => {
    return (
        <div className="flex items-center mb-[2px]">
            <img src={props.correct ? "/check-circle-fill.svg" : props.error ? "/warning-circle-fill.svg" : "/check-circle-bold.svg" }  alt="Password Rule Verification Image" />
            <p className={`openSans text-xs pl-2 ${props.error && !props.correct ? "text-red-500" : ""}`}>{props.rule}</p>
        </div>
    )
}

export default PasswordRulesComponent
