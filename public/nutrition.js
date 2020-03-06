const nutritionHtml = `<section class="performance-facts">
<table class="performance-facts__table">
    <thead>
        <th class="small-info" colspan="2">
        Per Serving
        </th>
        <td class="small-info">Serving Size <span class="data-serving-size">2</span></td>
    </tr>
    </thead>
    <tbody>
    <tr class="thick-row">
        <th colspan="2">
        <b>Calories</b>
        <span class="data-calories"></span>
        </th>
        <td>
        <b>Fat Cal.</b>
        <span class="data-calories-from-fat"></span>
        </td>
    </tr>
    <tr>
        <td colspan="3" class="small-info">
        <b>% Daily Value</b>
        </td>
    </tr>
    <tr>
        <th colspan="2">
        <b>Total Fat</b>
        <span class="data-total-fat"></span>
        </th>
        <td>
        <b><span class="data-total-fat-dv"></span></b>
        </td>
    </tr>
    <tr>
        <td class="blank-cell">
        </td>
        <th>
        Saturated Fat
        <span class="data-sat-fat"></span>
        </th>
        <td>
        <b><span class="data-sat-fat-dv"></span></b>
        </td>
    </tr>
    <tr>
        <td class="blank-cell">
        </td>
        <th>
        Trans Fat
        <span class="data-trans-fat"></span>
        </th>
        <td>
        </td>
    </tr>
    <tr>
        <th colspan="2">
        <b>Cholesterol</b>
        <span class="data-cholesterol"></span>
        </th>
        <td>
        <b><span class="data-cholesterol-dv"></span></b>
        </td>
    </tr>
    <tr>
        <th colspan="2">
        <b>Sodium</b>
        <span class="data-sodium"></span>
        </th>
        <td>
        <b><span class="data-sodium-dv"></span></b>
        </td>
    </tr>
    <tr>
        <th colspan="2">
        <b>Total Carbohydrate</b>
        <span class="data-total-carb"></span>
        </th>
        <td>
        <b><span class="data-total-carb-dv"></span></b>
        </td>
    </tr>
    <tr>
        <td class="blank-cell">
        </td>
        <th>
        Dietary Fiber
        <span class="data-dietary-fiber"></span>
        </th>
        <td>
        <b><span class="data-dietary-fiber-dv"></span></b>
        </td>
    </tr>
    <tr>
        <td class="blank-cell">
        </td>
        <th>
        Sugars
        <span class="data-sugars"></span>
        </th>
        <td>
        </td>
    </tr>
    <tr>
        <th colspan="2">
        <b>Protein</b>
        <span><span class="data-protein"></span></span>
        </th>
        <td>
        </td>
    </tr>
    </tbody>
</table>
</section>`;

const nutritionSmallHtml = `<section class="performance-facts">
<table class="performance-facts__table">
    <thead>
        <tr>
            <th class="small-info" colspan="2">
                Per Serving
            </th>
            <td class="small-info">Serving Size <span class="data-serving-size"></span></td>
        </tr>
    </thead>
    <tbody>
        <tr class="thick-row">
            <td>
                <b>Calories</b>
                <span class="data-calories"></span>
            </td>
            <td>
                <b>Fat Cal.</b>
                <span class="data-calories-from-fat"</span>
            </td>
            <td>
                <b>Total Fat</b>
                <span class="data-total-fat"></span>
            </td>
        </tr>
        <tr>
            <td>
                <b>Protein</b>
                <span><span class="data-protein"></span></span>
            </td>
            <td>
                <b>Cholest.</b>
                <span class="data-cholesterol"></span>
            </td>
            <td>
                <b>Sod.</b>
                <span class="data-sodium"></span>
            </td>
        </tr>
    </tbody>
</table>
</section>`;
