<script src="https://cdn.jsdelivr.net/gh/Ferisp/Widget@main/word-counter.js"></script>
<script>
counter=function(){
  var value=$("#text").val();
  if (value.length==0){
    $("#wordCount").html(0);
    $("#totalChars").html(0);
    $("#charCountNoSpace").html(0);
    return
    }
  var regex=/\s+/gi;
  var wordCount=value.trim().replace(regex," ").split(" ").length;
  var totalChars=value.length;
  var charCountNoSpace=value.replace(regex,"").length;
    $("#wordCount").html(wordCount);
    $("#totalChars").html(totalChars);
    $("#charCountNoSpace").html(charCountNoSpace);
}
  $(document).ready(function(){
    $("#count").click(counter);
    $("#text").change(counter);
    $("#text").keydown(counter);
    $("#text").keypress(counter);
    $("#text").keyup(counter);
    $("#text").blur(counter);
    $("#text").focus(counter);
})
</script>
<!-- End JavaScript --
