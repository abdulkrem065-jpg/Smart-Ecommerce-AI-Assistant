const fs = require('fs');

const fixFile = (path) => {
    let code = fs.readFileSync(path, 'utf8');
    code = code.replace(/import \{ useStore \} from '..\/..\/..\/store\/useStore';/g, "import { useStore } from '../../../store';");
    code = code.replace(/import \{ ConfirmModal \} from '..\/..\/ui\/ConfirmModal';/g, "import { ConfirmModal } from '../../ConfirmModal';");
    fs.writeFileSync(path, code);
};

fixFile('src/components/Admin/tabs/SalesInvoicesTab.tsx');
fixFile('src/components/Admin/tabs/PurchaseInvoicesTab.tsx');
