import {Label, Slider} from "radix-ui";

type InputSliderParams = {
    value: number,
    id: string,
    label: string,
    onChange: (value: number) => void,
    defaultValue?: number,
    minValue?: number,
    maxValue?: number,
    step?: number,
    ariaLabel?: string
}

const SliderInput = ({
                         id,
                         label,
                         defaultValue = 0,
                         maxValue = 5000,
                         minValue = 0,
                         value,
                         step = 1,
                         ariaLabel,
                         onChange
                     }: InputSliderParams) => {
    // TODO: Update colors
    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex w-full content-center justify-between">
                <Label.Root htmlFor={id} className="text-sm font-semibold text-slate-700">{label}</Label.Root>
                <p className="text-sm text-slate-700">{value}</p>
            </div>
            <Slider.Root id={id} min={minValue} className="relative flex items-center w-full h-5 touch-none select-none"
                         defaultValue={[defaultValue]} max={maxValue} step={step} value={[value]}
                         onValueChange={(values) => onChange(values[0])}>
                <Slider.Track className="bg-slate-100 shadow-inner flex-1 relative rounded-full h-1">
                    <Slider.Range className="absolute bg-rose-600 rounded-full h-full"/>
                </Slider.Track>
                <Slider.Thumb
                    className="transition-all block w-8 h-5 shadow-md shadow-gray-300 rounded-full bg-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-rose-600"
                    aria-label={ariaLabel || "Slider Input"}/>
            </Slider.Root>
        </div>
    );
};

export default SliderInput;