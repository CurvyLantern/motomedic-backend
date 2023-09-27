<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css">

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" crossorigin="anonymous">
    <title> API Test </title>

    <style>
        @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300&display=swap');

        body {
            font-family: 'Open Sans', sans-serif;

        }

        .search {

            top: 6px;
            left: 10px;
        }

        .form-control {

            border: none;
            padding-left: 32px;
        }

        .form-control:focus {

            border: none;
            box-shadow: none;
        }

        .green {

            color: green;
        }
    </style>
</head>

<body class="" style="background-color: #f1f1f1;">

    {{-- <section class="bg-white container border p-2 m-auto mt-4 border rounded"> --}}
    {{--    <h3> --}}
    {{--        {{ Session::get('email') }} --}}
    {{--        --}}{{-- @foreach ($products as $data) --}}
    {{--    <h3> {{$data->productName}} --}}
    {{--    <img src="products/{{$data->primaryImg}}" width="100"> --}}
    {{--    @endforeach --}}
    {{--    </h3> --}}
    {{-- </section> --}}


    <section class="bg-white container border p-2 m-auto mt-4 border rounded">
        <h3 class="text-center p-2"> Total Order </h3>

        {{-- @foreach ($context as $data )
        {{$data}}
        @endforeach --}}

        <div class="row">
            <div class="col-12">
                <div class="container mt-5 px-2">
                    <div class="table-responsive">
                        <table class="table table-responsive table-borderless">

                            <thead>
                                <tr class="bg-light">
                                    <th scope="col" width="5%"><i class="fa-sharp fa-solid"> </i>#id</th>
                                    <th scope="col" width="20%">Order Date</th>
                                    <th scope="col" width="10%">Status</th>
                                    <th scope="col" width="20%">Amount</th>
                                    <th scope="col" class="text-end" width="20%"><span>Action</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach ($context['orders'] as $order )
                                <tr>
                                    <td>{{$order->id}}</td>
                                    <td>{{$order->created_at}}</td>
                                    <td><i class="fa-solid fa-truck-ramp-box"></i><span class="ms-1">{{$order->status}}</span></td>
                                    <td>{{$order->total}}</td>
                                    <td class="text-end" width="20%">
                                        <a href="{{url('/api/v2/orders')}}">
                                            <i class="fa-regular fa-pen-to-square"></i>
                                        </a>
                                        <a href="#">
                                            <i class="fa-solid fa-trash-can"></i>
                                        </a>
                                        <a href="#">
                                            <i class="fa-regular fa-eye"></i>
                                        </a>
                                    </td>
                                </tr>
                                @endforeach
                            </tbody>
                        </table>

                    </div>

                </div>
            </div>
        </div>


    </section>

    {{-- <section class="bg-white container border p-2 m-auto mt-4 border rounded">
    <h3 class="text-center p-2"> Brand Create </h3>
    <form class="p-4 " action="{{route('create.request')}}" method="post" enctype="multipart/form-data">
        {{ csrf_field() }}

        <div class="form-group">
            <label class="form-label"> Name </label>
            <input type="text" class="form-control" name="name">
        </div>

        <div class="form-group">
            <label class="form-label"> Description </label>
            <input type="text" class="form-control" name="description">
        </div>

        <div class="mb-3">
            <label class="form-label">Input image file</label>
            <input class="form-control" type="file" name="image">
        </div>

        <button type="submit" class="btn btn-primary">Submit</button>
    </form>

</section> --}}

    {{-- <section class="bg-white container border p-2 m-auto mt-4 border rounded">
    <h3 class="text-center p-2"> Service Section </h3>

    <form class="p-4 " action="{{ url('api/service/create') }}" method="post" enctype="multipart/form-data">
        {{ csrf_field() }}

        <fieldset class="gap-3">
            <div class="form-group">
                <label for="serviceName"> Enter Your Service Name </label>
                <input type="text" class="form-control" id="serviceName" placeholder="Enter Your Service Name "
                    name="serviceName">
            </div>

            <div class="form-group">
                <label for="serviceName">Service description </label>
                <input type="text" class="form-control" id="description" placeholder="Enter Your Service Name"
                    name="description">
            </div>

            <div class="mb-3">
                <label for="formFile" class="form-label">Input image file</label>
                <input class="form-control" type="file" id="img" name="img">
            </div>

            <div class="form-group">
                <label for="serviceName">Service price </label>
                <input type="text" class="form-control" id="price" placeholder="Enter Your Service price"
                    name="price">
            </div>

            <div class="form-group">
                <label for="serviceName">Service durationHours </label>
                <input type="text" class="form-control" id="durationHours"
                    placeholder="Enter Your Service durationHours" name="durationHours">
            </div>

            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="featured">
                <label class="form-check-label" for="featured">
                    featured
                </label>
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
        </fieldset>
    </form>

</section>


<section class="bg-white container border p-2 m-auto mt-4 border rounded">
    <h3 class="text-center p-2"> Login Section </h3>
    <form class="p-4 " action="{{ url('api/login/auth') }}" method="post">
        {{ csrf_field() }}

        <div class="form-group">
            <label for="email">Email address</label>
            <input type="email" class="form-control" id="email" aria-describedby="emailHelp"
                placeholder="Enter email" name="email">
            <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone
                else.</small>
        </div>
        <div class="form-group">
            <label for="password">Password</label>
            <input type="password" class="form-control" id="password" placeholder="Password" name="password">
        </div>
        <div class="form-group form-check">
            <input type="checkbox" class="form-check-input" id="exampleCheck1">
            <label class="form-check-label" for="exampleCheck1">Check me out</label>
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
    </form>

</section>


<section class="bg-white container border p-2 m-auto mt-4 border rounded">
    <h3 class="text-center p-2"> Registration Section </h3>
    <form class="p-4 " action="{{ url('api/register') }}" method="post">
        {{ csrf_field() }}

        <div class="form-group">
            <label for="adminName">Admin name</label>
            <input type="text" class="form-control" id="adminName" aria-describedby="nameHelp"
                placeholder="Enter admin name " name="adminName">
        </div>

        <div class="form-group">
            <label for="email">Email address</label>
            <input type="email" class="form-control" id="email" aria-describedby="emailHelp"
                placeholder="Enter email" name="email">
            <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone
                else.</small>
        </div>


        <div class="form-group">
            <label for="password">Password</label>
            <input type="password" class="form-control" id="password" placeholder="Password" name="password">
        </div>
        <button type="submit" class="btn btn-primary m-2">Submit</button>
    </form>

</section>


<section class="bg-white container border p-2 m-auto mt-4 border rounded">
    <h3 class="text-center p-2"> Product Category </h3>

    <form class="p-4 " action="{{ url('api/category/store') }}" method="post" enctype="multipart/form-data">
        {{ csrf_field() }}

        <fieldset class="gap-3">
            <div class="form-group">
                <label for="categoryName"> Category Name </label>
                <input type="text" class="form-control" id="categoryName"
                    placeholder="Enter Your Service Name " name="categoryName">
            </div>

            <div class="form-group">
                <label for="serviceName">Category description </label>
                <input type="text" class="form-control" id="description"
                    placeholder="Enter Your Service Name" name="description">
            </div>

            <div class="mb-3">
                <label for="formFile" class="form-label">Input image file</label>
                <input class="form-control" type="file" id="img" name="img">
            </div>

            <div class="form-group">
                <label for="parentCategoryId"> parent Category </label>
                <input type="text" class="form-control" id="parentCategoryId"
                    placeholder="Enter Your parentCategoryId" name="parentCategoryId">
            </div>

            <button type="submit" class="btn btn-primary">Submit</button>
        </fieldset>
    </form>

</section>

<section class="bg-white container border p-2 m-auto mt-4 border rounded">
    <h3 class="text-center p-2"> Product Brand </h3>

    <form class="p-4 " action="{{ url('api/brand/create') }}" method="post" enctype="multipart/form-data">
        {{ csrf_field() }}

        <fieldset class="gap-3">
            <div class="form-group">
                <label for="brandName"> Brandy Name </label>
                <input type="text" class="form-control" id="brandName" placeholder="Enter Your Brand Name "
                    name="brandName">
            </div>

            <div class="form-group">
                <label for="description">Brand description </label>
                <input type="text" class="form-control" id="description"
                    placeholder="Enter Your brand Description" name="description">
            </div>

            <div class="mb-3">
                <label for="formFile" class="form-label">Input image file</label>
                <input class="form-control" type="file" id="img" name="img">
            </div>

            <button type="submit" class="btn btn-primary">Submit</button>
        </fieldset>
    </form>

</section>



<section class="bg-white container border p-2 m-auto mt-4 border rounded">
    <h3 class="text-center p-2"> Products Section </h3>

    <form class="p-4 " action="{{ url('api/product/create') }}" method="post" enctype="multipart/form-data">
        {{ csrf_field() }}

        <fieldset class="gap-3">
            <div class="form-group">
                <label for="serviceName"> Enter Your Product Name </label>
                <input type="text" class="form-control" id="serviceName"
                    placeholder="Enter Your Service Name " name="productName">
            </div>

            <div class="form-group">
                <label for="categoryId">Product categoryId </label>
                <input type="number" class="form-control" id="categoryId" placeholder="Enter Your categoryId"
                    name="categoryId">
            </div>

            <div class="form-group">
                <label for="brandId">Product brandId </label>
                <input type="number" class="form-control" id="brandId" placeholder="Enter Your brandId"
                    name="brandId">
            </div>

            <div class="form-group">
                <label for="sku">Product sku </label>
                <input type="text" class="form-control" id="sku" placeholder="Enter Your sku"
                    name="sku">
            </div>

            <div class="form-group">
                <label for="model">Product model </label>
                <input type="text" class="form-control" id="model" placeholder="Enter Your model"
                    name="model">
            </div>

            <div class="form-group">
                <label for="color">Product color </label>
                <input type="text" class="form-control" id="color" placeholder="Enter Your color"
                    name="color">
            </div>

            <div class="form-group">
                <label for="material">Product material </label>
                <input type="text" class="form-control" id="material" placeholder="Enter Your material"
                    name="material">
            </div>

            <div class="form-group">
                <label for="size">Product size </label>
                <input type="text" class="form-control" id="size" placeholder="Enter Your size"
                    name="size">
            </div>

            <div class="form-group">
                <label for="year">Product year </label>
                <input type="text" class="form-control" id="year" placeholder="Enter Your year"
                    name="year">
            </div>

            <div class="form-group">
                <label for="compitibility">Product compitibility </label>
                <input type="text" class="form-control" id="compitibility"
                    placeholder="Enter Your compitibility" name="compitibility">
            </div>

            <div class="form-group">
                <label for="condition">Product condition </label>
                <input type="text" class="form-control" id="condition" placeholder="Enter Your condition"
                    name="condition">
            </div>

            <div class="form-group">
                <label for="weight">Product weight </label>
                <input type="text" class="form-control" id="weight" placeholder="Enter Your weight"
                    name="weight">
            </div>

            <div class="form-group">
                <label for="quantity">Product quantity </label>
                <input type="text" class="form-control" id="quantity" placeholder="Enter Your quantity"
                    name="quantity">
            </div>

            <div class="form-group">
                <label for="price">Product price </label>
                <input type="text" class="form-control" id="price" placeholder="Enter Your price"
                    name="price">
            </div>


            <div class="form-group">
                <label for="discount">Product discount </label>
                <input type="text" class="form-control" id="discount" placeholder="Enter Your discount"
                    name="discount">
            </div>




            <!-- ....................................... -->
            <div class="mb-3">
                <label for="primaryImg" class="form-label">Input primaryImg file</label>
                <input class="form-control" type="file" id="primaryImg" name="primaryImg">
            </div>

            <div class="mb-3">
                <label for="thumbImg" class="form-label">Input thumbImg file</label>
                <input class="form-control" type="file" multiple id="thumbImg" name="thumbImg[]">
            </div>

            <!-- ....................................... -->



            <div class="form-group">
                <label for="shortDescriptions">Product shortDescriptions </label>
                <input type="text" class="form-control" id="shortDescriptions"
                    placeholder="Enter Your shortDescriptions" name="shortDescriptions">
            </div>

            <div class="form-group">
                <label for="availability">Product availability </label>
                <input type="text" class="form-control" id="availability"
                    placeholder="Enter Your Service availability" name="availability">
            </div>

            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="1" id="status" name="status">
                <label class="form-check-label" for="status">
                    Status
                </label>
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
        </fieldset>
    </form>

</section> --}}








    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz" crossorigin="anonymous">
    </script>
    <script src="main.js"></script>
</body>
</body>

</html>
