<template>
  <!--导航栏页-->
  <div class="footer">
    <div class="footer_right">
      <a class="it" href="https://beian.miit.gov.cn" target="_blank">© 2021-2022 江苏衡正区块链科技有限公司          保留所有版权 | 苏ICP备2021009988号-1 </a>
    </div>
    <!--  -->
  </div>
</template>

<script>
export default {
  name: 'Nav',
  data() {
    return {
      // isCollapse:true
    }
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
  .footer {
    background: rgba(0, 0, 0, 0.6);
    position: absolute;
    height: 50px;
    bottom: 0;
    width: 100%;
    margin-top: -1px;
    z-index: -1;
    justify-content: space-between;
    .foot_content{
      padding-left: 11.5%;
      padding-right: 11.5%;
      height: 360px;
      color: #fff;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 77%;

      // div {
      //   height: 200px;
      //   width: 30%;
      // }
      .about_us{
          height: 200px;
          width: 30%;

        .title{
          height: 0.8rem;
          font-size: 0.327rem;
        }
        .border{
          height: 2px;
          display: flex;
          justify-content: flex-start;
          .red{
            border-bottom: 2px solid #00a0dc;
            width: 64px;
            height: 100%;
          }
          .gray{
            border-bottom: 1px solid #707070;
            // width: 308px;
            flex: 1;
            height: 100%;
          }
        }
        .info{
          margin-top: 0.39rem;
          opacity: 0.7;
          font-size: 0.218rem;
          line-height: 0.51rem;
          padding-left: 0.2rem;
          padding-right: 0.2rem;
        }
      }
      .customer_service{
          height: 200px;
          width: 30%;
        .title{
          height: 0.8rem;
          font-size: 0.327rem;
        }
        .border{
          height: 2px;
          display: flex;
          justify-content: flex-start;
          .red{
            border-bottom: 2px solid #00a0dc;
            width: 64px;
            height: 100%;
          }
          .gray{
            border-bottom: 1px solid #707070;
            flex: 1;
            height: 100%;
          }
        }
        .list{
          padding-left: 0.2rem;
          padding-right: 0.2rem;
          opacity: 0.7;
          font-size: 0.188rem;
          height: 80px;
          line-height: 0.5rem;
          border-bottom: 1px solid #707070;
          display: flex;
          align-items: center;
          justify-content: space-between;
          div{
            height: auto;
            width: auto;
          }
          div:hover {
              cursor: pointer; //鼠标变手
          }
        }
      }
      .follow_us {
        height: 200px;
        width: 30%;
        .title{
          height: 0.8rem;
          font-size: 0.327rem;
        }
        .border{
          height: 2px;
          display: flex;
          justify-content: flex-start;
          .red{
            border-bottom: 2px solid #00a0dc;
            width: 64px;
            height: 100%;
          }
          .gray{
            border-bottom: 1px solid #707070;
            flex: 1;
            height: 100%;
          }
        }
        .secCode {
          width: 100%;
          margin:20px;
          display: flex;
          div {
            text-align: center;
            padding: 5px;
            width:  40%;
            p {
              padding: 3px;
              opacity: 0.7;
              font-size: 0.188rem;
            }
          }
        }
      }
      .contact_us{
        height: 200px;
        width: 30%;
        .title{
          height: 0.8rem;
          font-size: 0.327rem;
        }
        .border{
          height: 2px;
          display: flex;
          justify-content: flex-start;
          .red{
            border-bottom: 2px solid #00a0dc;
            width: 64px;
            height: 100%;
          }
          .gray{
            border-bottom: 1px solid #707070;
            flex: 1;
            height: 100%;
          }
        }
        .address{
          opacity: 0.7;
          font-size: 0.188rem;
          line-height:0.36rem;
          height: 50px;
          padding-left: 0.2rem;
          padding-right: 0.2rem;
        }
        .tel{
          margin-top: 0.22rem;
          opacity: 0.7;
          font-size: 0.188rem;
          line-height: 0.36rem;
          height: 35px;
          padding-left: 0.2rem;
          padding-right: 0.2rem;
        }
        .qq{
          opacity: 0.7;
          font-size: 0.188rem;
          line-height: 0.36rem;
          height: 35px;
          padding-left: 0.2rem;
          padding-right: 0.2rem;
        }
        .email{
          opacity: 0.7;
          font-size: 0.188rem;
          line-height: 0.36rem;
          height: 35px;
          padding-left: 0.2rem;
          padding-right: 0.2rem;
        }
      }
    }
    .footer_right{
      position: relative;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #000;
      // opacity: 0.7;
      font-size: 14px;
      a{
        text-decoration:none;
        color: #fff;
        cursor: pointer;
        display: inline-block;
      }
      .it{

      }
      .aggrement{
        display: inline-block;
      }
    }

  }
    @media (max-width: 768px){
      .footer{

        flex-direction: column;
        padding-top: 50px!important;
        height: auto!important;
        .foot_content{
          flex-direction: column!important;
          height: auto!important;
          .contact_us,.customer_service,.follow_us{
            font-size:14px!important;
            width: 100%!important;
            .address{
              line-height: 20px!important;
            }
          }
          .contact_us{
            .title{
              margin-bottom: 10px!important;
              font-size:16px!important;
            }
            .tel{
              margin-top: 20px!important;
            }
            .tel,.qq,.email,.address{
              font-size:14px!important;
            }
          }
          .customer_service{
            .title{
              margin-top: 15px!important;
              margin-bottom: 10px!important;
              font-size:16px!important;
            }
            .list{
              div{
                font-size:14px!important;
              }
            }
          }
          .follow_us{
            margin-top: 20px!important;
            .title{
              margin-bottom: 10px!important;
              font-size:16px!important;
            }
            .secCode p{
               font-size:14px!important;
            }
          }
        }
        .footer_right{
          position: relative;
          flex-direction: column;
          padding-bottom: 20px!important;
        }
        .it{
          text-align: center!important;
          font-size: 14px!important;
        }
        .aggrement{
          font-size: 14px!important;
        }
        .privacyPolicy{
          font-size: 14px!important;
        }
      }
    }
</style>
