const Select = ({ disabled = false, className, options = [], selectLabel, ...props }) => (
    <select
        className={`${className} rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50`}
        {...props}
        disabled={disabled}
    >
        <option value="">-Select {selectLabel}-</option>
        {options.map(({ value, label }, index) => (
            <option key={value || index} value={value}>
                {label}
            </option>
        ))}
    </select>
);

export default Select