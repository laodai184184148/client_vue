<template>
  <div>
    <!-- <div class="row">
      <div class="col-md-12">
        <div class="up-information">
          <div class="up-information--detail">
            <h5>Kết quả eKYC</h5>
            <strong>
              Kết quả
            </strong>
            <span v-if="ekycResult.similarity > 0.7">Ảnh tương đồng</span>
            <span v-else>Ảnh không tương nhau</span>
            <br />
            <strong>
              Độ tương đồng
            </strong>
            <span>cxyz</span>
          </div>
        </div>
      </div>
    </div>
    <br /> -->
    <div class="row">
      <div class="col-md-12">
        <div class="up-information">
          <div class="up-information--detail">
            <h5>Thông tin</h5>
            <br />
            <div class="form-group row">
              <label for="id" class="col-sm-2 col-form-label"> Số chứng minh</label>
              <div class="col-sm-10">
                <input id="id" class="form-control" type="text" disabled :value="kycResult.id" />
              </div>
            </div>
            <div class="form-group row">
              <label for="name" class="col-sm-2 col-form-label">Họ và tên</label>
              <div class="col-sm-4">
                <input id="name" class="form-control" type="text" disabled :value="kycResult.name" />
              </div>
              <label for="birthday" class="col-sm-2 col-form-label">Ngày sinh</label>
              <div class="col-sm-4">
                <input id="birthday" class="form-control" type="text" disabled :value="kycResult.birthday" />
              </div>
            </div>
            <div class="form-group row">
              <label for="sex" class="col-sm-2 col-form-label">Giới tính</label>
              <div class="col-sm-4">
                <input id="id" class="form-control" type="text" disabled :value="kycResult.sex" />
              </div>
              <label for="hometown" class="col-sm-2 col-form-label">Nguyên quán</label>
              <div class="col-sm-4">
                <input id="hometown" class="form-control" type="text" disabled :value="kycResult.hometown" />
              </div>
            </div>
            <div class="form-group row">
              <label for="address" class="col-sm-2 col-form-label">Nơi ĐKHK thường trú</label>
              <div class="col-sm-10">
                <input id="address" class="form-control" type="text" disabled :value="kycResult.address" />
              </div>
            </div>
            <div class="form-group row">
              <label for="ethnicity" class="col-sm-2 col-form-label">Dân tộc</label>
              <div class="col-sm-4">
                <input id="ethnicity" class="form-control" type="text" disabled :value="kycResult.ethnicity" />
              </div>
              <label for="religion" class="col-sm-2 col-form-label">Tôn giáo</label>
              <div class="col-sm-4">
                <input id="religion" class="form-control" type="text" disabled :value="kycResult.religion" />
              </div>
            </div>
            <div class="form-group row">
              <label for="issueBy" class="col-sm-2 col-form-label">Cấp bởi</label>
              <div class="col-sm-4">
                <input id="issueBy" class="form-control" type="text" disabled :value="kycResult.issueBy" />
              </div>
              <label for="issueDate" class="col-sm-2 col-form-label">Ngày cấp</label>
              <div class="col-sm-4">
                <input id="issueDate" class="form-control" type="text" disabled :value="kycResult.issueDate" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "EkycResult",
  props: {
    ekycResult: Object,
    kycResult: Object
  },
  watch: {
    kycResult: function(newVal) {
      console.log(newVal);
    }
  }
});
</script>

<style scoped>
.up-information {
  width: 100%;
  border: solid 3px #c1c3c5;
  padding: 20px;
  border-radius: 10px;
  position: relative;
  display: flex;
}
.up-information--detail {
  display: block;
  flex: 60%;
  padding-left: 1em;
}

label {
  font-size: 14px;
}
</style>
