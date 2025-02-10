
import { Button, Col, Container, Form as BaseForm, Row } from "react-bootstrap";

export type SearchFormProps = {
    paramAddress1: string;
    paramAddress2?: string;
    changeParamAddress1: any;
    clear: any;
    search: any;
}

export const SearchForm: React.FC<SearchFormProps> = (props) => {
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        props.search();
    };

    return (
        <Container>
            <BaseForm style={{margin: 10}} onSubmit={handleSubmit}>
                <Row>
                    <Col>
                        <BaseForm.Control
                            name={"paramAddress1"}
                            placeholder={"住所１"}
                            type={"text"}
                            value={props.paramAddress1}
                            onChange={props.changeParamAddress1}
                        />
                    </Col>
                    {/*<Col>
                        <BaseForm.Control
                            name={"paramAddress2"}
                            placeholder={"住所２"}
                            type={"text"}
                        />
                    </Col>*/}
                    <Col>
                        <Button
                            onClick={props.search}
                        >
                            Search
                        </Button>
                        {"  "}
                        <Button
                            variant="secondary"
                            onClick={props.clear}
                        >
                            Clear
                        </Button>
                    </Col>
                </Row>
            </BaseForm>
        </Container>
    )
}