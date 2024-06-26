import { Navbar } from "./components/navbar";
import { Login } from "./components/login";
import { Bank } from "./components/bank";
import { Account } from "./components/account";
import { CAccount } from "./components/createAccount";
import { ErrPage } from "./components/404";
import { Stock } from "./components/stock";
import { Test } from "./components/test";
import { CompanyItem } from "./components/companyItem";
import { CompanyList } from "./components/companyList";
import { Modal } from "./components/modal";
customElements.define('nav-bar',Navbar)
customElements.define('comp-stock',Stock)
customElements.define('comp-modal',Modal)
customElements.define('page-test',Test)
customElements.define('page-login',Login)
customElements.define('page-bank',Bank)
customElements.define('page-account',Account)
customElements.define('page-cuser',CAccount)
customElements.define('page-404',ErrPage)
customElements.define('listitem-company',CompanyItem)
customElements.define('list-company',CompanyList)