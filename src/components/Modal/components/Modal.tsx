import { Card, FlexChild, FlexLayout, TextStyles, Modal, TextField, Button, Radio } from '@cedcommerce/ounce-ui';
import React, { useState, useEffect } from 'react';
import jwt_decode from "jwt-decode";
import { ArrowRight } from 'react-feather';
import { CedcommerceLogo, ShopifyLogo, ShoplineLogo, WooCommerceLogo } from '../../../assets/Svg';
import '../css/styles.css';
import { useLocation } from "react-router";
import Loader from './Loader';

const Auth = () => {
    const [open2, toggleModal2] = useState(true);
    const [selected, setselected] = useState("")
    const [decodedToken, setdecodedToken] = useState<any>({})
    const [storeUrl, setstoreUrl] = useState<string>("")
    const [ErrorMessage, setErrorMessage] = useState('')
    const [fulldata, setfulldata] = useState<any>({})
    const location = useLocation();
    const [loading, setloading] = useState<boolean>(false);
    const [shopName, setshopName] = useState<any>({})
    const [urlselected, seturlselected] = useState<boolean>(false);
    const [state, setstate] = useState<any>({})
    const [selectedUrl, setselectedUrl] = useState('')

    const primaryAction2 = {
        loading: false,
        content: "Connect",
        onClick: async () => {
            const regexPattern = /^(https?:\/\/)?([a-z0-9-]+\.myshopify\.com)(\/.*)?$/;
            if (!regexPattern.test(storeUrl)) {
                setErrorMessage('Invalid shop url format');
            } else {
                setErrorMessage('');
                await fetch(process.env.REACT_APP_BASE_URL + "shopifyhome/installation/install", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // Authorization: `Bearer ${process.env.REACT_APP_BEARER_TOKEN}`
                    },
                    body: JSON.stringify({ "tokenData": decodedToken?.data, "shopUrl": storeUrl, "fullremoteData": fulldata })
                }).then(res => res.json()).then(data => {
                    if (data?.success) {
                        window.open(process.env.REACT_APP_BASE_URL + data?.url, "_self")
                    }
                    else {
                        console.error(data?.message)
                    }
                }
                ).catch(err => console.error(err))
            }

        },
    };
    const secondaryAction2 = {
        content: "Cancel",
        loading: false,
        onClick: () => {
            toggleModal2(!open2);
        },
    };
    useEffect(() => {
        const param = location.search
        const searchParams = new URLSearchParams(param);
        // Convert search parameters to a JSON object

        let jsonResult: any = {};

        if (searchParams.size > 0) {
            searchParams.forEach((value, key) => {
                jsonResult[key] = value;
            });
            setfulldata(jsonResult);
            let decoded = jsonResult['data'] ? jwt_decode(jsonResult['data']) : null;
            let state= jsonResult['state'] ? jwt_decode(jsonResult['state']) : null;
            setstate(state)
            setdecodedToken(decoded)
        }

    }, [location])





    const handleOpenWindow = () => {
        window.open("https://accounts.shopify.com/",  "_self", "width=800,height=600")
    }


    const selectMarketplace = (data: string) => {
        setselected(data);
        setloading(true);

        Object.keys(decodedToken).length > 0 && fetch(process.env.REACT_APP_BASE_URL + "shopifyhome/installation/checkForShop", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Authorization: `Bearer ${process.env.REACT_APP_BEARER_TOKEN}`
            },
            body: JSON.stringify({
                "remote_shop_id": decodedToken?.data?.shop_id ,
            })
        }).then(res => res.json()).then(data => {
            setloading(false)

            if (data?.success) {
                setshopName(data?.shops);
            }
            else {
                console.error(data?.message)
            }
        }
        ).catch(err => console.error(err))
    }

    const handleRadioChange=(value:any)=>{
        setselectedUrl(value?.username)
    }

    const handleConnectAction=()=>{
        if(selectedUrl.length>0){
             // Regular expression pattern to match Shopify shop URLs
  const regex:any = /^(https?:\/\/)?([a-zA-Z0-9-]+)\.myshopify\.com$/i;
            // console.log(process.env.REACT_APP_BASE_URL+`connector/request/shopifyCurrentRoute?current_route=dashboard&sAppId=1&shop=${selectedUrl}`)
            window.open(`https://admin.shopify.com/store/${regex.exec(selectedUrl)[2]}/apps/amazon-by-cedcommerce-dev-1` ,"_self")
        }else{
            toggleModal2(!open2)
        }
    }



    return (
        <>
            {loading ? <Loader />:
            <div className="init-Login__Wrapper">
                <div className="init-LoginPage">
                    <div className="inte-auth-custom">
                        <FlexLayout direction="vertical" spacing="extraLoose">
                            <FlexLayout valign="start" spacing="loose" wrap="noWrap">
                                <CedcommerceLogo />
                                <FlexLayout direction="vertical">
                                    <TextStyles
                                        alignment="left"
                                        fontweight="extraBold"
                                        headingTypes="LG-2.8"
                                        lineHeight="LH-4.0"
                                        textcolor="dark"
                                        type="Heading"
                                    >
                                        Welcome to CedCommerce Amazon Integrations
                                    </TextStyles>
                                    <TextStyles
                                        type="SubHeading"
                                        alignment="left"
                                        lineHeight="LH-4.0"
                                        utility="inte__Heading-font--xxl app-subtitle"
                                        textcolor='light'
                                    >
                                        By CedCommerce
                                    </TextStyles>
                                </FlexLayout>
                            </FlexLayout>

                            <FlexLayout direction="vertical" spacing="tight">
                                <Card
                                    cardType="Shadowed"
                                    onError={function noRefCheck() { }}
                                    onLoad={function noRefCheck() { }}
                                    primaryAction={{
                                        content: 'Connect',
                                        type: 'Primary',
                                        icon: <ArrowRight size={16} />,
                                        disable: Object.keys(shopName).length>0 && urlselected? false:selected.length > 0  ?false:true ,
                                        iconAlign: "right",
                                        onClick: handleConnectAction,
                                    }}
                                    subTitle="Select and connect channel to integrate with your Zoho acccount. Connect atleast one channel to finish onboarding."
                                    title="Multiple Amazon Account Connect"
                                >
                                    <FlexLayout spacing="loose">
                                        <FlexChild desktopWidth='33' tabWidth='33' mobileWidth='100'>
                                            <span onClick={() => selectMarketplace("shopify")}>
                                                <Card cardType='Bordered' extraClass={selected === "shopify" ? "Custom__Card--Logo-Border" : "Custom__Card--Logo"}>
                                                    <ShopifyLogo />
                                                </Card>
                                            </span>
                                        </FlexChild>
                                        <FlexChild desktopWidth='33' tabWidth='33' mobileWidth='100'>
                                            {/* <span onClick={() => { console.log("clicked woocommerce"); }}> */}
                                                <Card cardType='Bordered' extraClass={"disable"}>
                                                    <WooCommerceLogo />
                                                </Card>
                                            {/* </span> */}
                                        </FlexChild>
                                        <FlexChild desktopWidth='33' tabWidth='33' mobileWidth='100'>
                                            {/* <span onClick={() => { console.log("clicked shopline"); setselected("shopline") }}> */}
                                            <Card cardType='Bordered' extraClass={"disable"}>
                                                <ShoplineLogo />
                                            </Card>
                                            {/* </span> */}
                                        </FlexChild>
                                    </FlexLayout>
                                    {Object.keys(shopName).length>0&& <div style={{marginTop:"20px"}}><FlexLayout direction="vertical" spacing="mediumTight">
                                        <TextStyles fontweight="bold" >select the store you want to connect</TextStyles>
                                        {Object.values(shopName).map((value:any,count:number)=>{
                                            return (
                                                <Radio
                                                description={'select this shop'}
                                                id={value?.username}
                                                key={count}
                                                value={value?.username}
                                                labelVal={value?.username}
                                                name={"shops"}
                                                onClick={()=>handleRadioChange(value)}
                                            />

                                            )
                                        }

                                        )}


                                    </FlexLayout></div>}

                                </Card>
                            </FlexLayout>
                        </FlexLayout>
                        <Modal
                            modalSize="medium"
                            open={!open2}
                            heading={"Shopify account connect"}
                            primaryAction={primaryAction2}
                            secondaryAction={secondaryAction2}
                            close={() => {
                                toggleModal2(!open2);
                            }}
                        >
                            <FlexLayout direction='vertical' spacing='loose'>
                                <TextStyles
                                    fontweight="bold"
                                    paragraphTypes="MD-1.4"
                                    type="Paragraph"
                                >
                                    Connection Credentials
                                </TextStyles>
                                <TextField
                                    name="Store URL"
                                    placeHolder="Enter shopify store URL"
                                    required
                                    value={storeUrl}
                                    onChange={(value: string) => setstoreUrl(value)}
                                    tabIndex={1}
                                    thickness="thick"
                                    type="text"
                                />
                                {ErrorMessage || <TextStyles textcolor='negative' >{ErrorMessage}</TextStyles>}
                                <FlexLayout spacing='extraTight'>
                                    <TextStyles
                                        fontweight="normal"
                                        paragraphTypes="MD-1.4"
                                        textcolor="light"
                                        type="Paragraph"
                                    >
                                        New to Shopify?
                                    </TextStyles>
                                    <Button
                                        content="Create an account"
                                        onAction={function noRefCheck() { }}
                                        onClick={() => handleOpenWindow()}
                                        thickness="thin"
                                        type="TextButton"
                                    />
                                </FlexLayout>
                            </FlexLayout>
                        </Modal>
                    </div>
                </div>
            </div >}
        </>
    );
}


export default Auth;