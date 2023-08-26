import { Dropdown, Input, Select } from 'antd';
import { useRef } from 'react';

export function CTDropdown({ items, render, children, useSelect, setSelect }) {
  return (
    <Dropdown
      onOpenChange={useSelect && ((e) => e && setSelect(useSelect))}
      menu={{
        items,
      }}
      placement='bottom'
      arrow
      dropdownRender={render}
    >
      {children}
    </Dropdown>
  );
}

export function CTUpload({ children, className, styles, onChange, accept }) {
  const InputRef = useRef(null);

  const handleOnChange = (files) => {
    const arrayFiles = Array.from(files);
    const res = arrayFiles.map((file, index) => {
      return {
        uid: `${file.name}-${index}`,
        name: file.name,
        url: URL.createObjectURL(file),
      };
    });
    onChange(res, files);
    InputRef.current.value = '';
    return;
  };
  const handleOnDrag = (files) => {
    console.log(files);
  };
  return (
    <div style={styles} className={`group border-2 border-dashed border-gray-300 rounded-md relative ${className}`}>
      <div>
        <input
          onDrop={(e) => handleOnDrag(e.dataTransfer.files, 1)}
          type='file'
          accept={accept}
          multiple
          onChange={(e) => handleOnChange(e.target.files)}
          className='w-full h-full absolute top-0 left-0 opacity-0 cursor-pointer z-10'
          ref={InputRef}
        />
        {children}
      </div>
    </div>
  );
}

export function CTInput({
  mode,
  title,
  className,
  styles,
  addonBefore,
  addonAfter,
  type,
  size,
  error,
  value,
  defaultValue,
  selectOptions,
  placeholder,
  disabled,
  selectMode,
  loading,
  onChange,
}) {
  const HandleOnChange = (value) => {
    onChange(value);
  };
  switch (mode) {
    case 'select': {
      return (
        <div style={styles} className={className}>
          {title && (
            <div className={`text-sm text-gray-500 transition-all ${disabled && 'text-gray-300'}`}>{title}:</div>
          )}
          <Select
            className='w-full'
            mode={selectMode}
            loading={loading}
            disabled={disabled}
            defaultValue={defaultValue}
            options={selectOptions}
            size={size}
            value={value}
            status={error ? 'error' : ''}
            onChange={HandleOnChange}
          />
        </div>
      );
    }
    default: {
      return (
        <div style={styles} className={className}>
          {title && (
            <div className={`text-sm text-gray-500 transition-all ${disabled && 'text-gray-300'}`}>{title}:</div>
          )}
          <Input
            size={size}
            type={type}
            disabled={disabled}
            value={value}
            status={error ? 'error' : ''}
            addonBefore={addonBefore}
            addonAfter={addonAfter}
            placeholder={placeholder}
            onChange={(e) => HandleOnChange(e.target.value)}
          />
        </div>
      );
    }
  }
}
