---
layout: default
title: Bibliography
---

<style>

tei-item {
    padding-bottom: 1%;
    padding-left: 2%;
    text-indent: -2%;
}

</style>

<div class="container-fluid">
    <div class="row">
        <div class="col">
            <h1>Bibliography</h1>
            <div id="bibliography"></div>
        </div>
    </div>
</div>

<script>
        var CETEIcean = new CETEI();

        CETEIcean.getHTML5("{{site.baseurl}}/about/bibliography.xml", function(data) {

                var bibliography = data.querySelector("tei-text")
                document.getElementById("bibliography").innerHTML = ""
                document.getElementById("bibliography").appendChild(bibliography)
                CETEIcean.addStyle(document, data)

        });
</script>