import Form, {useForm} from "./form";
import Item from "./item";
import {FormProvider} from "./contexts";
import ControlLabel from "./fields/controlLabel";
import TextField from "./fields/textField";
import MultiSelect from "./fields/multiSelect";
import DatePicker from "./fields/datePicker";
import DateTimePicker from "./fields/dateTimePicker";
import SelectAdornment from "./fields/selectAdornment";
import Checkbox from "./fields/checkbox";

Form.Item = Item;
Form.Provider = FormProvider;
Form.useForm = useForm;

export {
    TextField,
    ControlLabel,
    DatePicker,
    Checkbox,
    MultiSelect,
    DateTimePicker,
    SelectAdornment
};
export default Form;
